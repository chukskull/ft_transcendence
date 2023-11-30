import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
// import { WsGuard } from './ws.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ namespace: 'gameSockets', cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  handleDisconnect(client: Socket) {}

  @WebSocketServer() server;
  handleConnection(client: Socket) {
    console.log('client connected');
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(client: Socket) {
    console.log('user joined queue', client.handshake.query);
    // this.gameService.joinQueue(client);
    return true;
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('leaveQueue')
  async leaveQueue(client: Socket) {
    this.gameService.leaveQueue(client);
  }

  /*
   *	create Game
   */

  // @UseGuards(WsGuard)
  @SubscribeMessage('createGame')
  async createGame(client: Socket) {
    const isInQueue = this.joinQueue(client);
    const opponentId = this.gameService.queue.find(
      (player) => player.socket !== client,
    )?.id;
    if (isInQueue) this.gameService.createGame(client, opponentId);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('sendBallState')
  async updateBall(client: Socket, @MessageBody() payload: any) {
    this.gameService.updateBall(client, payload);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('sendPaddleState')
  async updatePaddle(client: Socket, @MessageBody() payload: any) {
    this.gameService.updatePaddle(client, payload);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('updateScore')
  async updateScore(client: Socket, @MessageBody() payload: any) {
    this.gameService.updateScore(client, payload);
  }

  /*
   * handling invite friends
   */
  // @UseGuards(WsGuard)
  @SubscribeMessage('inviteFriend')
  async inviteFriend(client: Socket) {
    const friendId = this.jwtService.decode(
      client.handshake.query.token as string,
    );
    this.gameService.inviteFriend(client, friendId);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('inviteResponse')
  async inviteResponse(client: Socket, @MessageBody() payload: any) {
    this.gameService.inviteResponse(client, payload);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('acceptInvite')
  async acceptInvite(client: Socket, @MessageBody() payload: any) {
    this.gameService.acceptInvite(client, payload);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('declineInvite')
  async declineInvite(client: Socket, @MessageBody() payload: any) {
    this.gameService.declineInvite(client, payload);
  }
}
