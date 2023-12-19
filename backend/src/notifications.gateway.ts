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
const jwt = require('jsonwebtoken');

@Injectable()
@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = jwt.verify(
      client.handshake.query.token,
      process.env.JWT_SECRET,
    )?.sub;
    client.join(`userNotif-${userId}`);
  }

  newAchievement(achievement: Achievement, userId: number) {
    this.server.to(`userNotif-${userId}`).emit('newAchievement', achievement);
  }

  sendPVPRequest(inviter: User, userId: number) {
    this.server.to(`userNotif-${userId}`).emit('newPVPRequest', inviter);
  }

  handleDisconnect(client: Socket) {}
}
