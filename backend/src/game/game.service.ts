import { Injectable } from '@nestjs/common';
import { Body } from 'matter-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Achievement } from 'src/achievement/achievement.entity';
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
export const PADDLE1_POSITION = GAME_HEIGHT / 2;
export const PADDLE2_POSITION = GAME_HEIGHT / 2;

export enum PlayerNumber {
  One,
  Two,
}

@Injectable()
export class GameService {
  public queue: Array<{ id: number; socket: Socket }> = [];
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
  async inviteFriend(client: Socket, friendId: number): Promise<any> {
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token);
    if (!user) {
      client.disconnect();
      return;
    }
    const friend = await this.userService.userProfile(friendId);
    if (!friend) return;
    if (!this.onlineUsers.has(friendId)) {
      this.onlineUsers.set(friendId, new Set<Socket>());
    }
    const friendSockets = this.onlineUsers.get(friendId);
    if (!friendSockets) return;
    friendSockets.forEach((socket) => {
      socket.emit('inviteResponse', { id: user.id, username: user.username });
    });
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
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    // create game instance
    game.startGame()
  }

  async declineInvite(client: Socket, payload: any): Promise<void> {
    const { player2 } = payload;
    const game = this.activeGames[client.id+ ',' + player2.id];
    if (!game) return;
    delete this.activeGames[client.id + ',' + player2.id];
    game.endGame()
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
    const { player1, player2 } = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    else {
      const prevBall = { ...game.ball };
      game.updateBall(prevBall);
    }
  }

  async updatePaddle(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
    const game = this.activeGames[player1.id + ',' + player2.id];
    if (!game) return;
    game.updatePaddle();
  }

  async updateScore(client: Socket, payload: any): Promise<void> {
    const { player1, player2 } = payload;
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
      const match = await this.matchHistory.findOne({
        where: { player1: { id: player1.id }, player2: { id: player2.id } },
      })
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
    return true;
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
    socket.on('acceptInvite', (payload) => {
      this.acceptInvite(socket, payload); // starts game inside acceptInvite
    });
    const isInQueue = this.joinQueue(socket);
    if (isInQueue) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      if (player1 && player2) {
        const game = new GameInstance(
          player1.socket,
          player2.socket
        );
        this.activeGames[player1.id + ',' + player2.id] = game;
        game.startGame();
      }
    }

  }

}
