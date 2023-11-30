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
  @WebSocketServer() server;

  newEmit(data: any, emitedEvent: any, roomName: any) {
    if (roomName) this.server.to(roomName).emit(emitedEvent, data);
    else this.server.emit(emitedEvent, data);
  }

  handleDisconnect(client: Socket) {}
  handleConnection(client: Socket) {
    console.log('gaeme socker connected');
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(
    @MessageBody()
    data: {
      token: string;
    },
    client: Socket,
  ) {
    this.gameService.joinQueue(client, data?.token);
    return true;
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(client: Socket) {
    this.gameService.leaveQueue(client);
  }

  /*
   *	create Game
   */

  @SubscribeMessage('createGame')
  async createGame(client: Socket) {
    const opponentId = this.gameService.queue.find(
      (player) => player.socket !== client,
    )?.id;
  }

  @SubscribeMessage('sendBallState')
  async updateBall(client: Socket, @MessageBody() payload: any) {
    this.gameService.updateBall(client, payload);
  }

  @SubscribeMessage('sendPaddleState')
  async updatePaddle(client: Socket, @MessageBody() payload: any) {
    this.gameService.updatePaddle(client, payload);
  }

  @SubscribeMessage('updateScore')
  async updateScore(client: Socket, @MessageBody() payload: any) {
    this.gameService.updateScore(client, payload);
  }

  /*
   * handling invite friends
   */
  @SubscribeMessage('inviteFriend')
  async inviteFriend(
    @MessageBody()
    data: {
      token: string;
      friendIwantToInvite: number;
    },
    client: Socket,
  ) {
    const { token, friendIwantToInvite } = data;
    const roomName = 'ubgerhiougherpu' + client.id + ',' + friendIwantToInvite;
    this.gameService.inviteFriend(client, friendIwantToInvite, token, roomName);
    client.join('ubgerhiougherpu' + client.id + ',' + friendIwantToInvite);
  }

  @SubscribeMessage('inviteResponse')
  async inviteResponse(client: Socket, @MessageBody() payload: any) {
    this.gameService.inviteResponse(client, payload);
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite(client: Socket, @MessageBody() payload: any) {
    this.gameService.acceptInvite(client, payload);
  }

  @SubscribeMessage('declineInvite')
  async declineInvite(client: Socket, @MessageBody() payload: any) {
    this.gameService.declineInvite(client, payload);
  }
}
