import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'ws';

const chatSockets: Socket[][] = [];
const channelSockets: number[] = [];

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (args[0].url.includes('chat')) {
      const id = args[0].url.replace(/[^0-9]/g, '');
      if (!chatSockets[id]) chatSockets[id] = [];
      chatSockets[id].push(client);
      channelSockets.push(id);
      this.logger.log(`Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    channelSockets.forEach(function (id) {
      if (chatSockets[id]) {
        const idx = chatSockets[id].indexOf(client);
        if (idx > -1) chatSockets[id].splice(idx, 1);
        this.logger.log(`Client disconnected: ${client.id}`);
      }
    });
  }

  @SubscribeMessage('newMessage')
  handleMessage(data: any) {
    const res = JSON.stringify({ event: 'newMessage', data: data });
    chatSockets[data.channel].forEach(function (socket) {
      socket.send(res);
    });
  }
}
