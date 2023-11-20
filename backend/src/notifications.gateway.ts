import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    client.join(`user-${userId}`);
    console.log(`Client with userId ${userId} connected`);
  }

  newFriendRequest(data: any, userId: number) {
    this.server.to(`user-${userId}`).emit('newFriendRequest', data);
  }

  newAchievement(data: any, userId: number) {
    this.server.to(`user-${userId}`).emit('newAchievement', data);
  }

  newMessage(data: any, userId: number) {
    this.server.to(`user-${userId}`).emit('msgNotif', data);
  }
  handleDisconnect(client: Socket) {}
}
