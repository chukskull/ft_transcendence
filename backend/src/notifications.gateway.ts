import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      const userId = jwt.verify(
        client.handshake.query.token,
        process.env.JWT_SECRET,
      )?.sub;
      client.join(`userNotif-${userId}`);
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }
  }

  newAchievement(achievement: Achievement, userId: number) {
    this.server.to(`userNotif-${userId}`).emit('newAchievement', achievement);
  }

  sendPVPRequest(inviteRequest: any, userId: number) {
    inviteRequest.inviterObject = null;
    this.server.to(`userNotif-${userId}`).emit('newPVPRequest', inviteRequest);
  }

  handleDisconnect(client: Socket) {}
}
