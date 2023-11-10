import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './conversation.service';
import { Chat } from './conversation.entity';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private conversationService: ConversationService) {}

  handleConnection(client: Socket) {
    const conversationId = client.handshake.query.conversationId;
    client.join(`conversation_${conversationId}`);
  }

  handleDisconnect(client: Socket) {
    // You can uncomment this line if you want to leave all rooms when disconnecting.
    // client.leaveAll();
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: number;
      sender: number;
      message: string;
    },
  ) {
    const { conversationId, sender, message } = data;

    const chatMessage = new Chat();
    // chatMessage.sender = sender;
    chatMessage.message = message;
    chatMessage.time = new Date();

    try {
      await this.conversationService.addMessageToConversation(
        conversationId,
        chatMessage,
      );

      // Broadcast the message to all clients in the conversation room
      this.server
        .to(`conversation_${conversationId}`)
        .emit('newMessage', chatMessage);
    } catch (error) {
      console.error('Error saving and broadcasting the message:', error);
    }
  }
}
