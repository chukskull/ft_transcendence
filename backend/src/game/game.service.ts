import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';
import { GameInstance } from './game-instance';

export const GAME_WIDTH = 860
export const GAME_HEIGHT = 500
export const BALL_RADIUS = 10
export const PADDLE_WIDTH = 10
export const PADDLE_HEIGHT = 100
export const PADDLE_SPEED = 10
export const INIT_BALL_SPEED = 10
export const PADDLE1_POSITION = { x: 10, y: GAME_HEIGHT /2}
export const PADDLE2_POSITION = { x: 980, y: GAME_HEIGHT /2}
export const BALL_POSITION = { x: GAME_WIDTH/2, y: GAME_HEIGHT/2 }
export const DAMPING = 0.999
export const MAX_ANGLE = 5 * Math.PI / 12

export enum PlayerNumber { One, Two }
export enum Color {
	White = 'white', Green = 'green', teal = 'teal'
}

@Injectable()
export class GameService {

	private queue: Array<{ id: number, socket: Socket }> = []
	private currPlayers = new Array<{ id: number, socket: Socket }>()
	private activeGames: { [key: string]: GameInstance} = {}
	public onlineUsers = new Map<number, Set<Socket>>()

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly gameGateway: GameGateway,
	) {
		
	}
}