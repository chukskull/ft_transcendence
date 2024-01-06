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
import { IsString, Length, validateOrReject } from 'class-validator';
const jwt = require('jsonwebtoken');
import { plainToClass } from 'class-transformer';

export class MessageDto {
  @IsString()
  @Length(1, 200)
  message: string;
}
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

    let userId;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET)?.sub;
    } catch (err) {
      client.disconnect();
      throw new NotFoundException('token not valid');
    }

    try {
      const messageDto = plainToClass(MessageDto, { message });
      await validateOrReject(messageDto);
      const chatMessage =
        await this.conversationService.addMessageToConversation(
          conversationId,
          message,
          userId,
        );
      const roomName = `conversation_${conversationId}_chatRoom`;
      this.server.to(roomName).emit('messageReceived', chatMessage);
    } catch (error) {
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
