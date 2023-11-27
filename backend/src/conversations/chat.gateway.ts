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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './conversation.service';
import { Chat } from './conversation.entity';
import { User } from '../user/user.entity';
const jwt = require('jsonwebtoken');

function getUserProfile(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

@Injectable()
@WebSocketGateway({ namespace: 'chatSocket', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private conversationService: ConversationService,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
  ) {}
  handleDisconnect(client: Socket) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    console.log('connected');
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
    const userId = getUserProfile(token)?.sub;
    if (!userId) {
      return;
    }

    const chatMessage = this.ChatRepository.create();
    chatMessage.message = message;
    chatMessage.time = new Date();
    chatMessage.sender = await this.UserRepository.findOne({
      where: { id: userId },
    });

    try {
      await this.ChatRepository.save(chatMessage);
      await this.conversationService.addMessageToConversation(
        conversationId,
        chatMessage,
        userId,
      );

      const roomName = `conversation_${conversationId}_chatRoom`;
      this.server.emit('messageReceived', chatMessage);
    } catch (error) {
      this.server.emit('connect_error', error.message || 'Unknown error');
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
