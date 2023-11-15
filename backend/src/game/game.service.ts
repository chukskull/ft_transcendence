import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Stats } from './stats.entity';
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
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {
    setInterval(() => {
      Object.entries(this.activeGames).forEach(([key, game]) => {
        if (game.inactive) {
          const player1: number = parseInt(key.split(',')[0]);
          const player2: number = parseInt(key.split(',')[1]);
          this.currPlayers = this.currPlayers.filter(
            (player) => player.id !== player1 && player.id !== player2,
          );
          this.queue = this.queue.filter(
            (player) => player.id !== player1 && player.id !== player2,
          );
          this.matchHistory.create({
            player1ID: player1,
            player2ID: player2,
            winnerID:
              game.score.player1 > game.score.player2 ? player1 : player2,
          });
          this.statsRepository
            .findOne({ where: { user: { id: player1 } } })
            .then((stats) => {
              stats.total += 1;
              stats.score += game.score.player1;
              stats.winner += game.score.player1 > game.score.player2 ? 1 : 0;
              this.statsRepository.save(stats);
            });

          this.statsRepository
            .createQueryBuilder()
            .update()
            .set({
              total: () => 'total + 1',
              score: () => 'score + ' + game.score.player1,
              winner: () =>
                'winner + ' + (game.score.player1 > game.score.player2 ? 1 : 0),
            })
            .where('user = :id', { id: player1 })
            .execute();

          game.toRemove = true;
        }
      });
      this.activeGames = Object.fromEntries(
        Object.entries(this.activeGames)
          .filter(([key, game]) => !game.toRemove)
          .reduce((acc, [key, game]) => {
            acc.push([key, game]);
            return acc;
          }, []),
      );
      if (this.queue.length >= 2) {
        let [player1, player2] = this.queue.splice(0, 2);
        if (
          this.onlineUsers.get(player1.id) &&
          this.onlineUsers.get(player2.id)
        ) {
          this.currPlayers.push(player1, player2);
          this.activeGames[player1.id + ',' + player2.id] = new GameInstance(
            player1.socket,
            player2.socket,
          );
        } else if (this.onlineUsers.get(player1.id)) {
          this.queue.unshift(player2);
        } else if (this.onlineUsers.get(player2.id)) {
          this.queue.unshift(player1);
        }
      }
    }, 1000);
  }

  async inviteFriend(client: Socket, payload: any) : Promise<Boolean> {
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
        })
      })
    }
  }

  /*
    * checks if the cookie is valid
  */
  
  async checkCookie(@ConnectedSocket() client: Socket): Promise<any> {
    const cookie = client.handshake.headers?.cookie?.split(';').find(c => c.trim().startsWith(process.env.TOKEN))?.split('=')[1];
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

    if (!player2) { // if player2 is not defined, player1 is waiting for an opponent
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

