import { Injectable } from '@nestjs/common';
import { Body } from 'matter-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { MatchHistory } from 'src/match-history/match-history.entity';

export const GAME_WIDTH = 860;
export const GAME_HEIGHT = 500;
export const BALL_RADIUS = 16;
export const PADDLE_WIDTH = 13;
export const PADDLE_HEIGHT = 110;
export const PADDLE_SPEED = 10;
export const INIT_BALL_SPEED = 10;
export const PADDLE1_POSITION = GAME_HEIGHT / 2
export const PADDLE2_POSITION = GAME_HEIGHT / 2
export const MAX_ANGLE = (5 * Math.PI) / 12;

export enum PlayerNumber {
  One,
  Two,
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
        sock.emit('invite', { player: player1});
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

  /*
   * updates the game state
   */
  update(): void {
    for (const game of Object.values(this.activeGames)) {
      if (game.gameRunning) {
        const prevBall = { ...game.ball };
        game.updateBall(prevBall);
        game.updatePaddle();
      }
    }
  }



  async updateBall(client: Socket, payload: any): Promise<void> {
    const { player1, player2} = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    else {
      const prevBall = { ...game.ball };
      game.updateBall(prevBall);
    }
  }

  async updatePaddle(client: Socket, payload: any): Promise<void> {
    const { player1, player2} = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
      game.updatePaddle();
  }

  async updateScore(client: Socket, payload: any): Promise<void> {
    const { player1, player2} = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    else {
      game.updateScore();
      if (game.player1Score === 5 || game.player2Score === 5) {
        game.endGame();
        const winner = game.player1Score === 5 ? game.player1 : game.player2;
        const loser = game.player1Score === 5 ? game.player2 : game.player1;
        const match = new MatchHistory();
        match.winner = winner;
        match.loser = loser;
        match.date = new Date();
        await this.statsRepo.save(match);
        const winnerSocket = this.onlineUsers.get(parseInt(winner.id));
        const loserSocket = this.onlineUsers.get(parseInt(loser.id));
        if (winnerSocket) {
          winnerSocket.forEach((sock) => {
            sock.emit('changeState', { state: 'home' });
          });
        }

        if (loserSocket) {
          loserSocket.forEach((sock) => {
            sock.emit('changeState', { state: 'home' });
          });
        }
        this.currPlayers = this.currPlayers.filter((player) => {
          return player.id !== parseInt(winner.id) && player.id !== parseInt(loser.id);
        });
      }
    }
  }

  /*
  * Join matchmaking queue
  */
  async joinQueue(client: Socket): Promise<boolean> {
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token);
    if (!user) {
      client.disconnect();
      return false;
    }
    if (!this.onlineUsers.has(user.id)) {
      this.onlineUsers.set(user.id, new Set<Socket>());
    }
    this.onlineUsers.get(user.id)?.add(client);
    client.emit('changeState', { state: 'inQueue' });
    client.removeAllListeners('invite');
    client.on('invite', (payload) => {
      this.inviteFriend(client, payload);
    });
    client.removeAllListeners('joinQueue');
    client.on('joinQueue', () => {
      this.queue.push({ id: user.id, socket: client });
    });
    client.removeAllListeners('leaveQueue');
    client.on('leaveQueue', () => {
      this.leaveQueue(client);
    });
    client.removeAllListeners('disconnect');
    client.on('disconnect', () => {
      this.leaveQueue(client);
    });
  }
  /*
   * leave matchmaking queue
   */
  async leaveQueue(client: Socket) {
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token);
    if (!user) {
      client.disconnect();
      return;
    }
    if (this.onlineUsers.has(user.id)) {
      this.onlineUsers.get(user.id)?.delete(client);
      if (this.onlineUsers.get(user.id)?.size === 0) {
        this.onlineUsers.delete(user.id);
      }
    }
    this.queue = this.queue.filter((player) => {
      return player.id !== user.id;
    });
    client.emit('changeState', { state: 'home' }); // i don't know what state to change to when leaving queue
  }
  /*
   * creates a game instance and adds it to the activeGames object
   */
  createGame(socket: Socket, payload: any) {
    const { player1, player2 } = payload;
    if (!this.onlineUsers.get(player1.id)?.has(socket) || !this.onlineUsers.get(player2.id)?.has(socket))
      return;
    if (
      this.currPlayers.find((player) => player.id === player1.id) ||
      this.currPlayers.find((player) => player.id === player2.id)
    )
      return;

    if (!player2) {
      // if player2 is not defined, player1 is waiting for an opponent
      if (!this.queue.find((player) => player.id === player1.id)) {
        
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