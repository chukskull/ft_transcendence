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
import { ConversationService } from './conversation.service';
import { Chat } from './conversation.entity';
import { User } from '../user/user.entity';

@Injectable()
@WebSocketGateway({ namespace: 'chatSocket', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private conversationService: ConversationService) {}
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
      sender: User;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, sender, message } = data;
    const chatMessage = new Chat();
    chatMessage.sender = null;
    chatMessage.message = message;
    chatMessage.time = new Date();
    try {
      await this.conversationService.addMessageToConversation(
        conversationId,
        chatMessage,
        sender,
      );

      // Get the room name for the conversation
      // const roomName = `conversation_${conversationId}`;

      // Broadcast the message to users in the conversation
      // this.server.to(roomName).emit('newMessage', message);
      this.server.emit('newMessage', data);
      //   message: message,
      //   sender: sender,
      // });
    } catch (error) {
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
