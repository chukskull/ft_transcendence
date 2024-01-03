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
import { ConversationService } from './conversation.service';
const jwt = require('jsonwebtoken');

@Injectable()
@WebSocketGateway({ namespace: 'chatSocket', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private conversationService: ConversationService) {}
  handleDisconnect(client: Socket) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    const conversationId: any = client.handshake.query.conversationId;
    const roomName = `conversation_${conversationId}_chatRoom`;
    client.join(roomName);
  }

  @SubscribeMessage('messageSent')
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: number;
      message: string;
      token: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, message, token } = data;
    if (message.length > 200) {
      return;
    }
    let userId;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }

    try {
      const chatMessage =
        await this.conversationService.addMessageToConversation(
          conversationId,
          message,
          userId,
        );
      console.log('tjos is the message the user returened', chatMessage);
      const roomName = `conversation_${conversationId}_chatRoom`;
      this.server.to(roomName).emit('messageReceived', chatMessage);
    } catch (error) {
      this.server.emit('connectionErr', error.message || 'Unknown error');
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
