import { Injectable } from '@nestjs/common';
import { Body } from 'matter-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Achievement } from 'src/achievement/achievement.entity';
import { AchievementService } from 'src/achievement/achievement.service';
import { UserService } from 'src/user/user.service';
const jwt = require('jsonwebtoken');
import { Inject } from '@nestjs/common';
import { GameGateway } from './game.gateway';

export const GAME_WIDTH = 860;
export const GAME_HEIGHT = 500;
export const BALL_RADIUS = 16;
export const PADDLE_WIDTH = 13;
export const PADDLE_HEIGHT = 110;
export const PADDLE_SPEED = 10;
export const INIT_BALL_SPEED = 10;
export const PADDLE1_POSITION = GAME_HEIGHT / 2;
export const PADDLE2_POSITION = GAME_HEIGHT / 2;

export enum PlayerNumber {
  One,
  Two,
}

@Injectable()
export class GameService {
  public MatchMakingQueue: Array<{ id: number; socket: Socket }> = [];
  private currPlayers = new Array<{ id: number; socket: Socket }>();
  private activeGames: { [key: string]: GameInstance } = {};
  public onlineUsers = new Map<number, Set<Socket>>();
  public privateRoom = new Map<number, Set<Socket>>();

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

  /**
   * Invites a friend to play a game.
   *
   * @param client - The socket client initiating the invitation.
   * @param friendId - The ID of the friend to invite.
   * @returns A Promise that resolves to void.
   */
  async inviteFriend(
    client: Socket,
    friendId: number,
    token: string,
    roomName: string,
  ): Promise<any> {
    const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    if (userId == undefined) {
      client.disconnect();
      return;
    }
    const friend = await this.userService.userProfile(friendId);
    if (!friend) throw new Error('User not found');
    // this.notificationGateway.newEmit(
    //   'newGameInvite',
    //   { friend: userId, roomName: roomName },
    //   friendId,
    // );
  }

  async inviteResponse(client: Socket, payload: any): Promise<void> {
    const { friend } = payload;
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token);
    if (!user) {
      client.disconnect();
      return;
    }
    const friendSockets = this.onlineUsers.get(friend.id);
    if (!friendSockets) return;
    friend.socket.on('acceptInvite', (payload) => {
      this.acceptInvite(friend.socket, payload); // starts game inside acceptInvite
    });
    friend.socket.on('declineInvite', (payload) => {
      this.declineInvite(friend.socket, payload); // starts game inside acceptInvite
    });
  }

  async acceptInvite(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
    // receive payload from client
    player1.join(player1.id);
    player2.join(player2.id);
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    // create game instance
    // game.startGame();
  }

  async declineInvite(client: Socket, payload: any): Promise<void> {
    const { player2 } = payload;
    const game = this.activeGames[client.id + ',' + player2.id];
    if (!game) return;
    delete this.activeGames[client.id + ',' + player2.id];
  }

  /*
   * updates the game state
   */
  update(): void {
    for (const game of Object.values(this.activeGames)) {
      if (game.gameRunning) {
        const prevBall = { ...game.ball };
        // game.updateBall(prevBall);
      }
    }
  }

  async updateBall(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    else {
      const prevBall = { ...game.ball };
      // game.updateBall(prevBall);
    }
  }

  async updatePaddle(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
  }

  async updateScore(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    // game.updateScore();
    if (game.player1Score === 5 || game.player2Score === 5) {
      // game.endGame();
      player1.leave(player1.id);
      player2.leave(player2.id);
      if (this.activeGames.hasOwnProperty(player1.id + ',' + player2.id)) {
        player1.setStatus('online');
        player2.setStatus('online');
        delete this.activeGames[player1.id + ',' + player2.id];
      }
      const match = await this.matchHistory.findOne({
        where: { player1: { id: player1.id }, player2: { id: player2.id } },
      });
      if (match.winner === player1.id) {
        match.winsInARow = await this.matchHistory.trackWinsInARow(player1.id);
        match.losesInARow = 0;
      } else {
        match.winsInARow = 0;
        match.losesInARow = await this.matchHistory.trackWinsInARow(player1.id);
      }
      if (match.winner === player2.id) {
        match.winsInARow = await this.matchHistory.trackWinsInARow(player2.id);
        match.losesInARow = 0;
      } else {
        match.winsInARow = 0;
        match.losesInARow = await this.matchHistory.trackWinsInARow(player2.id);
      }

      if (match.winsInARow === 3) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '3 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }
      if (match.winsInARow === 5) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '5 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }

      if (match.winsInARow === 10) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '10 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }
      const achievement =
        game.player2Score === 0
          ? await this.achievementRepo.findOne({ where: { name: 'Ruthless!' } })
          : null;
      if (achievement) {
        this.achievementService.giveAchievement(
          game.player2Score === 0 ? player1.id : player2.id,
          achievement.id,
        );
      }
    }
  }

  /*
   * Join matchmaking MatchMakingQueue
   */
  async joinQueue(client: Socket, token: string): Promise<boolean> {
    const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;

    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set<Socket>());
      this.onlineUsers.get(userId)?.add(client);
    }
    client.join('MatchMakingQueue' + userId);
    const isInQueue = this.MatchMakingQueue.find((player) => {
      return player.id == userId;
    });
    if (!isInQueue) {
      this.MatchMakingQueue.push({ id: userId, socket: client });
      // this.server.to('MatchMakingQueue' + userId).emit('changeState', {
      //   state: 'inQueue',
      //   message: 'waiting for other opponent to join',
      // });
    } else {
      // this.server.to('MatchMakingQueue' + userId).emit('changeState', {
      //   state: 'failed',
      //   message: 'already in queue',
      // });
    }
    if (this.MatchMakingQueue.length >= 2) {
      const player1 = this.MatchMakingQueue.shift();
      const player2 = this.MatchMakingQueue.shift();
      this.createGame(player1, player2);
    }
    return true;
  }

  /*
   * leave matchmaking MatchMakingQueue
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
    this.MatchMakingQueue = this.MatchMakingQueue.filter((player) => {
      return player.id !== user.id;
    });
    client.emit('changeState', { state: 'home' }); // i don't know what state to change to when leaving MatchMakingQueue
  }
  /*
   * start game
   */
  createGame(player1: any, player2: any): void {
    player1.socket.join('gameStart' + player1.id);
    player2.socket.join('gameStart' + player2.id);
    const game = new GameInstance(player1.socket, player2.socket); // take the entire player
    // server.to('gameStart' + player1.id).emit('gameStarted');
    // server.to('gameStart' + player2.id).emit('gameStarted');
    game.startGame();
  }
}
