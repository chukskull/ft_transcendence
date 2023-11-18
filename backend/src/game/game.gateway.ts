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
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;
	private logger: Logger = new Logger('GameGateway');

	constructor(private readonly gameService: GameService
		, private readonly jwtService: JwtService,
	private readonly userService: UserService) { }

	afterInit(server: any) {
		this.logger.log('Initialized');
	}
	/*
	*	Handle connection and disconnection
	*/
	async	handleConnection(client: Socket, ...args: any[]) {
		const id = await this.gameService.checkCookie(client)['id']
		this.userService.setOnline(id)
		let connectedSockets = this.gameService.onlineUsers.get(id)
		if (!connectedSockets)
			connectedSockets = new Set<Socket>()
		connectedSockets.add(client)
		this.gameService.onlineUsers.set(id, connectedSockets)

	}

	async handleDisconnect(client: Socket) {
		const id = await this.gameService.checkCookie(client)['id']
		let connectedSockets = this.gameService.onlineUsers.get(id)
		if (connectedSockets) {
			connectedSockets.delete(client)
			if (connectedSockets.size == 0) {
				this.userService.setOffline(id)
				this.gameService.onlineUsers.delete(id)
			}
		}
	}
	/*
	*	create Game
	*/
	@SubscribeMessage('createGame')
	async createGame(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		const id = await this.gameService.checkCookie(client)['id']
		this.gameService.onlineUsers.get(id).add(client)
		this.gameService.createGame(client, payload)
	}

	/*
	* handling invite friends
	*/
	@SubscribeMessage('inviteFriend')
	async inviteFriend(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		const id = await this.gameService.checkCookie(client)['id']
		this.gameService.inviteFriend(client, payload)
	}
}