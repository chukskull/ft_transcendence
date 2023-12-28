import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { UserService } from 'src/user/user.service';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { NotifGateway } from 'src/notifications.gateway';
import con from 'ormconfig';
const jwt = require('jsonwebtoken');

export const GAME_WIDTH = 845;
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
    nickName: string;
  }> = [];
  public privateQueue: Array<{
    player1:{
      id: number;
      socket: Socket;
      score: number;
      nickName: string;
    },
    player2:{
      id: number;
      socket: Socket;
      score: number;
      nickName: string;
    }
  }> = [];

  constructor(
    private matchHistory: MatchHistoryService,
    private achievementService: AchievementService,
    private userService: UserService,
    private jwtService: JwtService,
    private notifGateway: NotifGateway,
    @InjectRepository(MatchHistory)
    private matchHistoryRepo: Repository<MatchHistory>,
  ) {}

  /**
   * Invites a friend to play a game.
   * @param client - The socket client initiating the invitation.
   * @param friendId - The ID of the friend to invite.
   * @returns A Promise that resolves to void.
   */
  async inviteFriend(
    client: Socket,
    friendId: number,
    token: string,
  ): Promise<any> {
    const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    if (!userId) {
      client.disconnect();
      return;
    }
    client.emit('changeState', { state: 'waitingForResponse' });
    const userProfile = await this.userService.userProfile(userId);
    this.privateQueue.push({
      player1: {
        id: userId,
        socket: client,
        score: 0,
        nickName: userProfile.nickName,
      },
      player2: {
        id: friendId,
        socket: null,
        score: 0,
        nickName: null,
      },
    });
    client.on('disconnect', () => {
      console.log('disconnected');
      return;
    });
    this.notifGateway.sendPVPRequest(userProfile, friendId);
  }
  async declinePVP(client: Socket, token: string, friendId: number) {
    const myId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    if (!myId) {
      client.disconnect();
      return;
    }
    this.privateQueue = this.privateQueue.filter((lobby) => {
      return lobby.player1.id !== myId && lobby.player2.id !== friendId;
    });
    client.emit('changeState', {
      state: 'decline',
      message: 'opponent declined your invitation',
    });
  }

  async acceptPVP(
    client: Socket,
    server: Server,
    token: string,
    inviterId: number,
  ) {
    const myId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    if (!myId) {
      client.disconnect();
      return;
    }
    const userProfile = await this.userService.userProfile(myId);
    const lobby = this.privateQueue.find((players) => {
      return players.player1.id == inviterId && players.player2.id == myId;
    });
    if (!lobby) {
      client.emit('changeState', { state: 'home' });
      return;
    }
    lobby.player2.socket = client;
    lobby.player2.nickName = userProfile.nickName;
    client.emit('changeState', { state: 'inGame' });
    const player1 = lobby.player1;
    const player2 = lobby.player2;
    await this.createGame(player1, player2, server);
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
    const isInQueue = this.MatchMakingQueue.find((player) => {
      return player.id == userId;
    });
    if (!isInQueue) {
      const userProfile = await this.userService.userProfile(userId);
      this.MatchMakingQueue.push({
        id: userId,
        socket: client,
        score: 0,
        nickName: userProfile.nickName,
      });
      // empty the the queue on disconnect
      client.emit('changeState', {
        state: 'inQueue',
        message: 'waiting for other opponent to join',
      });
    } else {
      client.emit('changeState', {
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
    this.MatchMakingQueue = this.MatchMakingQueue.filter((player) => {
      return player.id !== user.id;
    });
    client.emit('changeState', { state: 'home' }); // i don't know what state to change to when leaving MatchMakingQueue
  }
  /*
   * start game
   */
  async createGame(player1: any, player2: any, server: Server): Promise<void> {
    await this.userService.setStatus(player1.id, 'inGame');
    await this.userService.setStatus(player2.id, 'inGame');
    console.log('player1id: ' + player1.id);
    console.log('player2id: ' + player2.id);
    const matchHisto = await this.matchHistory.create({
      player1ID: player1.id,
      player2ID: player2.id,
    });
    const game = new GameInstance(
      player1,
      player2,
      server,
      matchHisto,
      this.matchHistoryRepo,
      this.achievementService,
      ); // take the entire player
      player1.socket.emit('gameStarted', {
        MyId: player1.id,
        myNickname: player1.nickName,
        OpponentId: player2.id,
        OpponentNickname: player2.nickName,
      });
      player2.socket.emit('gameStarted', {
        MyId: player2.id,
        myNickname: player2.nickName,
        OpponentId: player1.id,
        OpponentNickname: player1.nickName,
      });
    game.startGame();
  }
}
