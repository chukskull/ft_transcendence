import { Injectable } from '@nestjs/common';
import { Body } from 'matter-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';

export const GAME_WIDTH = 860;
export const GAME_HEIGHT = 500;
export const BALL_RADIUS = 16;
export const PADDLE_WIDTH = 13;
export const PADDLE_HEIGHT = 110;
export const PADDLE_SPEED = 10;
export const INIT_BALL_SPEED = 10;
export const PADDLE1_POSITION = { x: 10, y: GAME_HEIGHT / 2 };
export const PADDLE2_POSITION = { x: GAME_WIDTH - 10, y: GAME_HEIGHT / 2 };
export const BALL_POSITION = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
export const DAMPING = 0.999;
export const MAX_ANGLE = (5 * Math.PI) / 12;

export enum PlayerNumber {
  One,
  Two,
}
export enum Color {
  White = 'white',
  Green = 'green',
  teal = 'teal',
}

@Injectable()
export class GameService {
  private queue: Array<{ id: number; socket: Socket }> = [];
  private currPlayers = new Array<{ id: number; socket: Socket }>();
  private activeGames: { [key: string]: GameInstance } = {};
  public onlineUsers = new Map<number, Set<Socket>>();

  constructor(
    private matchHistory: MatchHistoryService,
    private jwtService: JwtService,
    @InjectRepository(MatchHistory)
    private readonly statsRepo: Repository<MatchHistory>,
  ) {
    setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  async inviteFriend(client: Socket, payload: any): Promise<Boolean> {
    const { player1, player2 } = payload;
    if (
      this.currPlayers.find((player) => player.id === player1.id) ||
      this.currPlayers.find((player) => player.id === player2.id)
    ) {
      return false;
    }
    const invUser = this.onlineUsers.get(player2.id);
    if (invUser) {
      invUser.forEach((sock) => {
        sock.emit('invite', { player: player1, color: Color.White });
        sock.removeAllListeners('invResponse');
        sock.once('invResponse', (response) => {
          invUser.forEach((sock_) => {
            if (
              sock_ !== sock &&
              response == true &&
              !this.currPlayers.find((player) => player.id === player2.id) &&
              !this.currPlayers.find((player) => player.id === player1.id) &&
              this.onlineUsers.get(player1.id)?.has(client)
            ) {
              if (
                this.queue.find((player) => player.id === player1.id) ||
                this.queue.find((player) => player.id === player2.id)
              ) {
                this.queue = this.queue.filter((player) => {
                  return player.id !== player1.id && player.id !== player2.id;
                });
              }
            }
          });
        });
      });
    }
  }

  async update() {
    for (const key in this.activeGames) {
      const game = this.activeGames[key];
      if (game.inactive) {
        delete this.activeGames[key];
        continue;
      }
      const ball = game.ball;
      const paddle1 = game.paddle1;
      const paddle2 = game.paddle2;
      const player1 = game.player1;
      const player2 = game.player2;
      const score = game.score;
      const speed = game.speed;

      Body.setVelocity(ball, {
        x: ball.velocity.x * DAMPING,
        y: ball.velocity.y * DAMPING,
      });

      if (ball.position.x < 0) {
        score.player2++;
        Body.setPosition(ball, BALL_POSITION);
        Body.setVelocity(
          ball,
          game.getNewStart(GAME_WIDTH, GAME_HEIGHT).velocity,
        );
        game.speed = INIT_BALL_SPEED;
        player1.emit('updateScore', { score });
        player2.emit('updateScore', { score });
        if (score.player2 === 10) {
          game.inactive = true;
          player1.emit('changeState', { state: 'gameOver' });
          player2.emit('changeState', { state: 'gameOver' });
          const matchHistory = new MatchHistory();
          matchHistory.player1 = player1.handshake.auth.user;
          matchHistory.player2 = player2.handshake.auth.user;
          matchHistory.winner = player2.handshake.auth.user;
          matchHistory.date = new Date();
          this.statsRepo.save(matchHistory);
        }
      } else if (ball && ball.position.x > GAME_WIDTH) {
        score.player1++;
        Body.setPosition(ball, BALL_POSITION);
        Body.setVelocity(
          ball,
          game.getNewStart(GAME_WIDTH, GAME_HEIGHT).velocity,
        );
        game.speed = INIT_BALL_SPEED;
        player1.emit('updateScore', { score });
        player2.emit('updateScore', { score });
        if (score.player1 === 10) {
          game.inactive = true;
          player1.emit('changeState', { state: 'gameOver' });
          player2.emit('changeState', { state: 'gameOver' });
          const matchHistory = new MatchHistory();
          matchHistory.player1 = player1.handshake.auth.user;
          matchHistory.player2 = player2.handshake.auth.user;
          matchHistory.winner = player1.handshake.auth.user;
          matchHistory.date = new Date();
          this.statsRepo.save(matchHistory);
        }
      }
    }
  }

  /*
   * checks if the cookie is valid
   */

  async checkCookie(@ConnectedSocket() client: Socket): Promise<any> {
    const cookie = client.handshake.headers?.cookie
      ?.split(';')
      .find((c) => c.trim().startsWith(process.env.TOKEN))
      ?.split('=')[1];
    if (!cookie) {
      client.disconnect();
      return;
    }
    return this.jwtService.verify(cookie);
  }
  /*
   * creates a game instance and adds it to the activeGames object
   */
  createGame(socket: Socket, payload: any) {
    const { player1, player2 } = payload;
    if (
      this.currPlayers.find((player) => player.id === player1.id) ||
      this.currPlayers.find((player) => player.id === player2.id)
    ) {
      return;
    }

    if (!player2) {
      // if player2 is not defined, player1 is waiting for an opponent
      if (!this.queue.find((player) => player.id === player1.id)) {
        this.queue.push({ id: player1.id, socket });
        socket.emit('changeState', { state: 'waitingForOponent' });
      } else {
        this.queue = this.queue.filter((player) => {
          return player.id !== player1.id; // remove player1 from the queue
        });
        this.queue.push({ id: player1.id, socket }); // add player1 to the queue
        socket.emit('changeState', { state: 'inGame' }); // change player1 state to inGame
      }
    } else {
      if (
        this.queue.find((player) => player.id === player1.id) ||
        this.queue.find((player) => player.id === player2.id)
      ) {
        this.queue = this.queue.filter((player) => {
          return player.id !== player1.id && player.id !== player2.id;
        });
      }
      this.currPlayers.push({ id: player1.id, socket });
      this.currPlayers.push({ id: player2.id, socket });
      this.activeGames[player1.id + ',' + player2.id] = new GameInstance(
        socket,
        socket,
      );
    }
  }
}
