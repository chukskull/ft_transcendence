import { Injectable } from '@nestjs/common';
import { Body } from 'matter-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { Achievement } from 'src/achievement/achievement.entity';
import { User } from 'src/user/user.entity';
import { CreateMatchHistoryDto } from 'src/match-history/dto/create-match-history.dto';
import { AchievementService } from 'src/achievement/achievement.service';
import { UserService } from 'src/user/user.service';

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
    private achievementService: AchievementService,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
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
    game.updateScore();
    if (game.player1Score === 5 || game.player2Score === 5) {
      game.endGame();
      if (this.activeGames.hasOwnProperty(player1.id + ',' + player2.id)) {
        player1.setStatus('online');
        player2.setStatus('online');
        delete this.activeGames[player1.id + ',' + player2.id];
      }
      const match = new CreateMatchHistoryDto();
      match.player1ID = player1.id;
      match.player2ID = player2.id;
      match.player1score = game.player1Score;
      match.player2score = game.player2Score;
      match.winnerID = game.player1Score > game.player2Score ? player1.id : player2.id;
      if (match.winnerID === player1.id) {
        match.winsInARow = await this.matchHistory.trackWinsInARow(player1.id);
        match.losesInARow = 0;
      } else {
        match.winsInARow = 0;
        match.losesInARow = await this.matchHistory.trackWinsInARow(player1.id);
      }
      if (match.winnerID === player2.id) {
        match.winsInARow = await this.matchHistory.trackWinsInARow(player2.id);
        match.losesInARow = 0;
      } else {
        match.winsInARow = 0;
        match.losesInARow = await this.matchHistory.trackWinsInARow(player2.id);
      }

      if (match.winsInARow === 3) {
        const achievement = await this.achievementRepo.findOne({where :{ name: '3 in a row' }});
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id); 
        }
      }
      if (match.winsInARow === 5) {
        const achievement = await this.achievementRepo.findOne({where :{ name: '5 in a row' }});
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id); 
        }
      }

      if (match.winsInARow === 10) {
        const achievement = await this.achievementRepo.findOne({where :{ name: '10 in a row' }});
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id); 
        }
      }
      const achievement = game.player2Score === 0 ? await this.achievementRepo.findOne({ where: { name: 'Ruthless!' }}) : null;
      if (achievement) {
        this.achievementService.giveAchievement(game.player2Score === 0 ? player1.id : player2.id, achievement.id);
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
      this.userService.setStatus(player1.id, 'inGame');
      this.userService.setStatus(player2.id, 'inGame');
      socket.emit('changeState', { state: 'inGame' });
      this.activeGames[player1.id + ',' + player2.id] = new GameInstance(
        socket,
        socket,
      );
    }
  }
}