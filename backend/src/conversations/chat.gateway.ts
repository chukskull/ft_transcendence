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
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('new connection');
    const conversationId = client.handshake.query.conversationId;
    client.join(`conversation_${conversationId}`);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('messageSent')
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: number;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId: any = client.handshake.query.userId;
    const { conversationId, message } = data;
    const chatMessage = this.ChatRepository.create();
    chatMessage.message = message;
    chatMessage.time = new Date();
    const sender = await this.UserRepository.findOne({
      where: { id: senderId },
    });
    chatMessage.sender = sender;
    await this.ChatRepository.save(chatMessage);
    try {
      await this.conversationService.addMessageToConversation(
        conversationId,
        chatMessage,
        senderId,
      );

      // Get the room name for the conversation
      // const roomName = `conversation_${conversationId}`;

      // Broadcast the message to users in the conversation
      // this.server.to(roomName).emit('newMessage', message);
      this.server.emit('newMessage', chatMessage);
      //   message: message,
      //   sender: sender,
      // });
    } catch (error) {
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
