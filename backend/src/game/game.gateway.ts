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
import { subscribe } from 'diagnostics_channel';

@WebSocketGateway({namespace: "/gameSocket"})
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
				this.leaveQueue(client)
			}
		}
	}

	/*
	*	Handle queue
	*/

	@SubscribeMessage('joinQueue')
	async joinQueue(@ConnectedSocket() client: Socket) : Promise<boolean> {
		this.gameService.joinQueue(client)
		return true
	}

	@SubscribeMessage('leaveQueue')
	async leaveQueue(@ConnectedSocket() client: Socket) {
		this.gameService.leaveQueue(client)
	}


	/*
	*	create Game
	*/

	@SubscribeMessage('createGame')
	async createGame(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		const isInQueue = this.joinQueue(client)
		if (isInQueue)
			this.gameService.createGame(client, payload);
	}

	@SubscribeMessage('updateBall')
	async updateBall(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		this.gameService.updateBall(client, payload)
	}

	@SubscribeMessage('updatePaddle')
	async updatePaddle(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		this.gameService.updatePaddle(client, payload)
	}

	/*
	* handling invite friends
	*/
	@SubscribeMessage('inviteFriend')
	async inviteFriend(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
		this.gameService.inviteFriend(client, payload)
	}
}