import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/user/auth/auth.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;
	private logger: Logger = new Logger('GameGateway');

	constructor(private readonly gameService: GameService
		, private readonly jwtService: JwtService,
	private readonly authService: AuthService) { }

	afterInit(server: any) {
		this.logger.log('Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		const cookie = client.handshake.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1]

		if (!cookie) {
			client.disconnect()
			return
		}
		const data = this.jwtService.verify(cookie)
		const id = data['id']
		this.authService.setOnline(id)
		this.gameService.onlineUsers.set(id, new Set<Socket>())
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('createGame')
	async handleCreateGame(@MessageBody() data: any) {
		
	}

	@SubscribeMessage('updateGame')
	async handleUpdateGame(@MessageBody() data: any) {
		const game = await this.gameService.updateGame(data.gameId, data.status, data.winnerId);
		const res = JSON.stringify({ event: 'gameUpdated', data: game });
		this.server.emit('gameUpdated', res);
	}

	@SubscribeMessage('getGame')
	async handleGetGame(@MessageBody() data: any) {
		const game = await this.gameService.getGame(data.gameId);
		const res = JSON.stringify({ event: 'game', data: game });
		this.server.emit('game', res);
	}

	@SubscribeMessage('getGames')
	async handleGetGames(@MessageBody() data: any) {
		const games = await this.gameService.getGames();
		const res = JSON.stringify({ event: 'games', data: games });
		this.server.emit('games', res);
	}
}