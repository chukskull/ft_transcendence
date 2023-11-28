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
import { User } from './user/user.entity';
import { Achievement } from './achievement/achievement.entity';

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

  newAchievement(achievement: Achievement, userId: number) {
    this.server.to(`user-${userId}`).emit('newAchievement', achievement);
  }

  handleDisconnect(client: Socket) {}
}
