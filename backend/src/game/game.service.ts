import { Injectable, NotFoundException } from '@nestjs/common';
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
import { pvpInvite } from './pvp.entity';
const jwt = require('jsonwebtoken');

export const GAME_WIDTH = 840;
export const GAME_HEIGHT = 500;
export const BALL_RADIUS = 16;
export const PADDLE_WIDTH = 13;
export const PADDLE_HEIGHT = 125;
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
    player1: {
      id: number;
      socket: Socket;
      score: number;
      nickName: string;
    };
    player2: {
      id: number;
      socket: Socket;
      score: number;
      nickName: string;
    };
  }> = [];

  constructor(
    private matchHistory: MatchHistoryService,
    private achievementService: AchievementService,
    private userService: UserService,
    private jwtService: JwtService,
    private notifGateway: NotifGateway,
    @InjectRepository(MatchHistory)
    private matchHistoryRepo: Repository<MatchHistory>,
    @InjectRepository(pvpInvite)
    private pvpInviteRepo: Repository<pvpInvite>,
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
    let userId;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }

    const userProfile = await this.userService.userProfile(userId);
    const friendProfile = await this.userService.userProfile(Number(friendId));
    if (friendProfile.status == 'inGame') {
      client.emit('changeState', {
        state: 'failed',
        message: 'friend is already in game',
      });
      return;
    }
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
      this.privateQueue = this.privateQueue.filter((lobby) => {
        return lobby.player1.id !== userId;
      });
    });
    setTimeout(() => {
      this.privateQueue = this.privateQueue.filter((lobby) => {
        return lobby.player1.id !== userId;
      });
      client.emit('changeState', {
        state: 'failed',
        message: 'friend did not respond',
      });
    }, 15000);
    const newInvite = await this.pvpInviteRepo.create({
      inviter: userProfile,
      friend: friendProfile,
      notifSent: true,
    });
    if (!newInvite) return;

    await this.pvpInviteRepo.save(newInvite);

    this.notifGateway.sendPVPRequest(newInvite, friendId);
  }
  async declinePVP(client: Socket, token: string, notifId: string) {
    let myId;
    try {
      myId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }

    const pvpNotif = await this.pvpInviteRepo.findOne({
      where: { id: notifId },
      relations: ['inviter', 'friend'],
    });
    this.privateQueue = this.privateQueue.filter((lobby) => {
      return (
        lobby.player1.id !== myId && lobby.player2.id !== pvpNotif.inviter.id
      );
    });
    pvpNotif.accepted = false;
    pvpNotif.declined = true;
    await this.pvpInviteRepo.save(pvpNotif);
    client.emit('changeState', {
      state: 'decline',
      message: 'opponent declined your invitation',
    });
  }

  async acceptPVP(
    client: Socket,
    server: Server,
    token: string,
    notifId: string,
  ) {
    let myId;
    try {
      myId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }

    const pvpNotif = await this.pvpInviteRepo.findOne({
      where: { id: notifId },
      relations: ['inviter', 'friend'],
    });
    if (!pvpNotif || pvpNotif.accepted || pvpNotif.friend.id != myId) return;
    const lobby = this.privateQueue.find((players) => {
      return (
        players.player1.id == pvpNotif.inviter.id && players.player2.id == myId
      );
    });
    if (!lobby) {
      client.emit('changeState', { state: 'home' });
      return;
    }
    lobby.player2.socket = client;
    lobby.player2.nickName = pvpNotif.friend.nickName;
    client.emit('changeState', { state: 'inGame' });
    const player1 = lobby.player1;
    const player2 = lobby.player2;
    // remove all privateQueue that has the same inviterId
    this.privateQueue = this.privateQueue.filter((lobby) => {
      return (
        (lobby.player1.id != pvpNotif.inviter.id && lobby.player2.id) ||
        (lobby.player2.id != pvpNotif.inviter.id && lobby.player1.id)
      );
    });
    pvpNotif.accepted = true;
    await this.pvpInviteRepo.save(pvpNotif);
    return await this.createGame(player1, player2, server);
  }

  /*
   * Join matchmaking MatchMakingQueue
   */
  async joinQueue(
    client: any,
    server: Server,
    token: string,
  ): Promise<boolean> {
    let userId;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }
    const isInQueue = this.MatchMakingQueue.find((player) => {
      return player.id == userId;
    });
    const inGame = await this.userService.isInGame(userId);
    if (!isInQueue && !inGame) {
      const userProfile = await this.userService.userProfile(userId);
      this.MatchMakingQueue.push({
        id: userId,
        socket: client,
        score: 0,
        nickName: userProfile.nickName,
      });
      // empty the the queue on disconnect
      client.on('disconnect', () => {
        this.MatchMakingQueue = this.MatchMakingQueue.filter((player) => {
          return player.id !== userId;
        });
      });
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
