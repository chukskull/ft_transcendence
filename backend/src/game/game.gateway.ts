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


  handleDisconnect(client: Socket) {
  }

  handleConnection(client: Socket) {
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(
    @MessageBody()
    data: {
      token: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.gameService.joinQueue(client, this.server, data?.token);
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(@ConnectedSocket() client: Socket) {
      await this.gameService.leaveQueue(client);
  }

  /*
   *	create Game
   */

  @SubscribeMessage('createGame')
  async createGame(client: Socket) {
    try {
      const opponentId = this.gameService.MatchMakingQueue.find(
        (player) => player.socket !== client,
      )?.id;
      this.gameService.createGame(client, opponentId, this.server);
    } catch (error) {
      // Handle error
      console.log("Cannot find opponent", error);
      return;
    }
  }

  @SubscribeMessage('inviteFriend')
  async inviteFriend(
    @MessageBody()
    data: {
      token: string;
      friendId: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { token, friendId } = data;
    this.gameService.inviteFriend(client, friendId, token);
  }

  @SubscribeMessage('acceptPVP')
  async acceptGameInvite(
    @MessageBody()
    data: {
      token: string;
      friendId: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { token, friendId } = data;
    this.gameService.acceptPVP(client, this.server, token);
  }
  @SubscribeMessage('declinePVP')
  async declineGameInvite(
    @MessageBody()
    data: {
      token: string;
      friendId: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { token, friendId } = data;
    this.gameService.declinePVP(client, token, friendId);
  }
}
