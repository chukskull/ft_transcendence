import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getSqljsManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Achievement } from 'src/achievement/achievement.entity';
import { AchievementService } from 'src/achievement/achievement.service';
import { UserService } from 'src/user/user.service';
import { MatchHistory } from 'src/match-history/match-history.entity';
const jwt = require('jsonwebtoken');

export const GAME_WIDTH = 860;
export const GAME_HEIGHT = 500;
export const BALL_RADIUS = 16;
export const PADDLE_WIDTH = 13;
export const PADDLE_HEIGHT = 110;
export const PADDLE_SPEED = 12;
export const INIT_BALL_SPEED = 10;
export const PADDLE1_POSITION = GAME_HEIGHT / 2;
export const PADDLE2_POSITION = GAME_HEIGHT / 2;
export const DIST_WALL_TO_PADDLE = 20;


@Injectable()
export class GameService {
  public MatchMakingQueue: Array<{
    id: number;
    socket: Socket;
    score: number;
  }> = [];
  public onlineUsers = new Map<number, Set<Socket>>();
  public privateQueue = Array<{ id: number; socket: Socket }>();

  constructor(
    private matchHistory: MatchHistoryService,
    private achievementService: AchievementService,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Achievement)
    private achievementRepo: Repository<Achievement>,
    @InjectRepository(MatchHistory)
    private matchHistoryRepo: Repository<MatchHistory>,
  ) {}

  /**
   * Invites a friend to play a game.
   *
   * @param client - The socket client initiating the invitation.
   * @param friendId - The ID of the friend to invite.
   * @returns A Promise that resolves to void.
   */
  async inviteFriend(
    client: Socket,
    server: Server,
    friendId: number,
    token: string,
    roomName: string,
  ): Promise<any> {
    const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    if (userId == undefined) {
      client.disconnect();
      return;
    }
    this.privateQueue.push({ id: userId, socket: client });
    const friend = await this.userService.userProfile(friendId);
    if (!friend) throw new Error('User not found');
    if (!this.onlineUsers.has(friendId)) {
      this.onlineUsers.set(friendId, new Set<Socket>());
      this.onlineUsers.get(friendId)?.add(client);
    }
    const friendSockets = this.onlineUsers.get(friendId);
    if (!friendSockets) return;
    // event to be discussed again
    friendSockets.forEach((friendSocket) => {
      friendSocket.emit('invited', {
        from: { id: userId, username: client.handshake.auth.username },
        roomName: roomName,
      });
    });
    // payload from frontend to be discussed
    client.on('acceptInvite', (payload) => {
      this.privateQueue.push({ id: friendId, socket: client });
      if (this.privateQueue.length >= 2) {
        const player1 = this.privateQueue.shift();
        const player2 = this.privateQueue.shift();
        this.createGame(player1, player2, server);
      }
    });
    client.on('declineInvite', (payload) => {
      client.emit('changeState', { state: 'home' });
      this.privateQueue.pop();
    });
  }

  async giveAchievement(
    player1: any,
    player2: any,
    game: GameInstance,
  ): Promise<void> {
    const match = await this.matchHistory.findOne({
      where: { player1: { id: player1.id }, player2: { id: player2.id } },
    });
    if (match.winner === player1.id) {
      match.player1.winsInARow = await this.matchHistory.trackWinsInARow(player1.id);
      if (match.player1.winsInARow === 3) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '3 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }
      if (match.player1.winsInARow === 5) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '5 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }
  
      if (match.player1.winsInARow === 10) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '10 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player1.id, achievement.id);
        }
      }
    } else {
      match.player1.winsInARow = 0;
    }
    if (match.winner === player2.id) {
      match.player2.winsInARow = await this.matchHistory.trackWinsInARow(player2.id);
      if (match.player2.winsInARow === 3) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '3 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player2.id, achievement.id);
        }
      }
      if (match.player2.winsInARow === 5) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '5 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player2.id, achievement.id);
        }
      }
  
      if (match.player2.winsInARow === 10) {
        const achievement = await this.achievementRepo.findOne({
          where: { name: '10 in a row' },
        });
        if (achievement) {
          this.achievementService.giveAchievement(player2.id, achievement.id);
        }
      }
    } else {
      match.player2.winsInARow = 0;
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

  /*
   * Join matchmaking MatchMakingQueue
   */
  async joinQueue(
    client: any,
    server: Server,
    token: string,
  ): Promise<boolean> {
    const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    // console.log('use id is', userId);
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set<Socket>());
      this.onlineUsers.get(userId)?.add(client);
    }
    client.join('MatchMakingQueue' + userId);
    const isInQueue = this.MatchMakingQueue.find((player) => {
      return player.id == userId;
    });
    if (!isInQueue) {
      this.MatchMakingQueue.push({ id: userId, socket: client, score: 0 });
      // empty the the queue on disconnect
      server.to('MatchMakingQueue' + userId).emit('changeState', {
        state: 'inQueue',
        message: 'waiting for other opponent to join',
      });
    } else {
      server.to('MatchMakingQueue' + userId).emit('changeState', {
        state: 'failed',
        message: 'already in queue/already in game',
      });
    }
    if (this.MatchMakingQueue.length >= 2) {
      const player1 = this.MatchMakingQueue.shift();
      const player2 = this.MatchMakingQueue.shift();
      this.createGame(player1, player2, server);
      return true;
    }
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
  async createGame(player1: any, player2: any, server: Server): Promise<void> {
    player1.socket.join('gameStart' + player1.id);
    player2.socket.join('gameStart' + player2.id);
    await this.userService.setStatus(player1.id, 'inGame');
    await this.userService.setStatus(player2.id, 'inGame');
    console.log('$$$$$$$$$$$$$$$$$$$$$-------------------- GAME CREATED');
    const matchHisto = this.matchHistory.create({
      player1ID: player1.id,
      player2ID: player2.id,
    });
    const game = new GameInstance(
      player1,
      player2,
      server,
      matchHisto,
      this.matchHistoryRepo,
    ); // take the entire player
    server.to('gameStart' + player1.id).emit('gameStarted', {
      MyId: player1.id,
      OpponentId: player2.id,
    });
    server
      .to('gameStart' + player2.id)
      .emit('gameStarted', { MyId: player2.id, OpponentId: player1.id });
    game.startGame();
  }

  /*
  * get final score
  */
  async updateFinalScore(
    game: GameInstance,
  ): Promise<void> {

    const match = await this.matchHistory.findOne({
      where: { player1: { id: game.player1.id }, player2: { id: game.player2.id } },
    });
    match.player1Score = game.player1Score;
    match.player2Score = game.player2Score;
    if (game.player1Score > game.player2Score) {
      match.winner = game.player1.id;
    } else {
      match.winner = game.player2.id;
    }
    console.log('match: ', match);
    await this.matchHistory.update(match);
  }

  async endGame(game: GameInstance) {
    await this.updateFinalScore(game);
    game.endGame();
  }
}
