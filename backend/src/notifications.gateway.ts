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
import { Achievement } from './achievement/achievement.entity';
const jwt = require('jsonwebtoken');
import { UserService } from './user/user.service';

@Injectable()
@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('joinRoom')
  async registerClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token: string },
  ) {
    try {
      const token = data?.token;
      if (token) {
        const userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
        client.join(`userNotif-${userId}`);
      }
    } catch (err) {
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
}
