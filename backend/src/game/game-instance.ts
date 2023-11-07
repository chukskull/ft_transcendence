import Matter, { Body, Bodies, Engine, World, Common, Vector, Events, Runner } from 'matter-js';
import { Socket } from 'socket.io';
import * as flatbuffers from 'flatbuffers';
import { PositionState } from './position-state';
import {
	GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, INIT_BALL_SPEED, PADDLE1_POSITION, PADDLE2_POSITION, BALL_POSITION, DAMPING, MAX_ANGLE, PlayerNumber, Color
} from './game.service';

export class GameInstance {
	private engine: Matter.Engine;
	private world: Matter.World;
	private ball: Matter.Body;
	private paddle1: Matter.Body;
	private paddle2: Matter.Body;
	private player1ready: boolean = false;
	private player2ready: boolean = false;
	public score: { player1: number, player2: number } = { player1: 0, player2: 0 };
	private speed: number = INIT_BALL_SPEED;
	private checkBallPaddleCollisionInterval: NodeJS.Timer
	public inactive = false;
	public toRemove = false;
	loop: NodeJS.Timer;

	constructor(public player1: Socket, public player2: Socket) {
		this.engine = Engine.create();
		this.world = this.engine.world;
		this.world.gravity.y = 0;
		this.world.gravity.x = 0;

		this.ball = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, BALL_RADIUS * 2, BALL_RADIUS * 2, {
			frictionAir: 0,
			restitution: 1,
		});
		this.paddle1 = Bodies.rectangle(PADDLE1_POSITION.x, PADDLE1_POSITION.y, PADDLE_WIDTH, PADDLE_HEIGHT, {
			isStatic: true,
			frictionAir: 0,
			restitution: 1,
		});

		this.paddle2 = Bodies.rectangle(PADDLE2_POSITION.x, PADDLE2_POSITION.y, PADDLE_WIDTH, PADDLE_HEIGHT, {
			isStatic: true,
			frictionAir: 0,
			restitution: 1,
		});

		Body.setVelocity(this.ball, { x: INIT_BALL_SPEED, y: INIT_BALL_SPEED });

		World.add(this.world, [this.ball, this.paddle1, this.paddle2]);
		player1.on('sendPaddleState', (state) => {
			const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
			const paddleState = PositionState.getRootAsPositionState(buffer);

			const x = paddleState.x();
			const y = paddleState.y();

			Body.setPosition(this.paddle1, { x, y });

			const builder = new flatbuffers.Builder();
			const offset = PositionState.createPositionState(builder, this.paddle2.position.x, this.paddle2.position.y);
			builder.finish(offset);

			player2.emit('updateOpponentPaddleState', builder.asUint8Array());
		});

		player2.on('sendPaddleState', (state) => {
			const buffer = new flatbuffers.ByteBuffer(new Uint8Array(state));
			const paddleState = PositionState.getRootAsPositionState(buffer);

			const x = paddleState.x();
			const y = paddleState.y();

			Body.setPosition(this.paddle2, { x, y });

			player1.emit('updateOpponentPaddleState', state);
		});

		player1.on('disconnect', () => {
			player2.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: true }));
			this.score.player1 = 0;
			this.score.player2 = 1;
			this.stopGame();
		});

		setTimeout(() => {
			player1.emit('changeState', JSON.stringify({ gameState: 'playing', playerNumber: 1, color: Common.choose(Color.White, Color.Green, Color.teal) }));
			player2.emit('changeState', JSON.stringify({ gameState: 'playing', playerNumber: 2, color: Common.choose(Color.White, Color.Green, Color.teal) }));
		}, 1000);

		player1.on('ready', () => {
			this.player1ready = true;
			if (this.player2ready)
				this.startGame();
			else
				player1.emit('waiting');
		});

		player2.on('ready', () => {
			this.player2ready = true;
			if (this.player1ready)
				this.startGame();
			else
				player2.emit('waiting');
		});


	}

	private startGame() {
		this.engine.velocityIterations = 10
		this.engine.positionIterations = 10

		this.loop = setInterval(() => {
			Engine.update(this.engine, 1000 / 60);
		}, 1000 / 60);
		Events.on(this.engine, 'collisionStart', (event) => {
			const pair = event.pairs[0];
			if (pair.bodyA === this.ball)
				this.handleBallPaddleCollision(pair.bodyB);
			else
				this.handleBallPaddleCollision(pair.bodyA);
		});
	}
	private	stopGame() {
		World.remove(this.world, [this.ball, this.paddle1, this.paddle2]);
		World.clear(this.world, false);
		Engine.clear(this.engine);
		clearInterval(this.loop);
		this.player1.removeAllListeners();
		this.player2.removeAllListeners();
		this.inactive = true;
	}

	private handleBallPaddleCollision(paddle: Matter.Body) {
		const angle = Math.min(Math.max(this.ball.position.y - paddle.position.y, -70), 70);
		const sign = (this.ball.position.x - paddle.position.x) > 0 ? 1 : -1;
		const velocity = {
			x: sign * this.speed * Math.cos(angle * Math.PI / 180),
			y: this.speed * Math.sin(angle * Math.PI / 180),
		};
		Body.setVelocity(this.ball, velocity);
		if (this.speed < 20)
			this.speed += 0.5;
	}

	private setPlayerWin(player: PlayerNumber) {
		if (player === PlayerNumber.One)
			this.score.player1++;
		else
			this.score.player2++;
	}
}