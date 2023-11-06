import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { User } from '../user/user.entity';
import { GameGateway } from './game.gateway';
import { Socket } from 'dgram';

export const GAME_WIDTH = 1000
export const GAME_HEIGHT = 600
export const BALL_RADIUS = 10
export const PADDLE_WIDTH = 10
export const PADDLE_HEIGHT = 100
export const PADDLE_SPEED = 10
export const INIT_BALL_SPEED = 10
export const PADDLE1_POSITION = { x: 10, y: 250 }
export const PADDLE2_POSITION = { x: 980, y: 250 }
export const BALL_POSITION = { x: 500, y: 300 }
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
	private activeGames: Map<number, Game> = new Map<number, Game>()
	public onlineUsers = new Map<number, Set<Socket>>()

	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly gameGateway: GameGateway,
	) { }
}