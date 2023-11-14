import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './conversation.service';
import { Chat } from './conversation.entity';
import { User } from '../user/user.entity';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private conversationService: ConversationService) {}

  handleConnection(client: Socket) {
    const conversationId = client.handshake.query.conversationId;
    client.join(`conversation_${conversationId}`);
  }

  handleDisconnect(client: Socket) {
    // Handle any necessary disconnection logic
  }

  @SubscribeMessage('message')
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
    chatMessage.sender = sender;
    chatMessage.message = message;
    chatMessage.time = new Date();

    try {
      await this.conversationService.addMessageToConversation(
        conversationId,
        chatMessage,
      );

      // Get the room name for the conversation
      const roomName = `conversation_${conversationId}`;

      // Broadcast the message to users in the conversation
      this.server.to(roomName).emit('newMessage', chatMessage);
    } catch (error) {
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
