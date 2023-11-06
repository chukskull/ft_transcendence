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
import { Socket, Server } from 'ws';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;
	private logger: Logger = new Logger('GameGateway');

	constructor(private readonly gameService: GameService) { }

	afterInit(server: any) {
		this.logger.log('Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('createGame')
	async handleCreateGame(@MessageBody() data: any) {
		const game = await this.gameService.createGame(data.player1Id, data.player2Id, data.customizationOptions);
		const res = JSON.stringify({ event: 'gameCreated', data: game });
		this.server.emit('gameCreated', res);
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