import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ namespace: 'gameSockets', cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}
  @WebSocketServer() server: Server;

  emitToClients(data: any, emitedEvent: any, roomName: any) {
    this.server.to(roomName).emit(emitedEvent, data);
  }

  handleDisconnect(client: Socket) {}
  handleConnection(client: Socket) {}

  @SubscribeMessage('joinQueue')
  async joinQueue(
    @MessageBody()
    data: {
      token: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.joinQueue(client, this.server, data?.token);
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
    const opponentId = this.gameService.MatchMakingQueue.find(
      (player) => player.socket !== client,
    )?.id;
    this.gameService.createGame(client, opponentId, this.server);
  }

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
    this.gameService.inviteFriend(
      client,
      this.server,
      friendIwantToInvite,
      token,
      roomName,
    );
    client.join('ubgerhiougherpu' + client.id + ',' + friendIwantToInvite);
  }
}
