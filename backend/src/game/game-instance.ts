import Matter, { Body, Bodies, Engine, World, Common, Events} from 'matter-js';
import { Socket } from 'socket.io';
import {
	GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, INIT_BALL_SPEED, PADDLE1_POSITION, PADDLE2_POSITION, BALL_POSITION, DAMPING, MAX_ANGLE, PlayerNumber
} from './game.service';

export class GameInstance {
		private engine: Matter.Engine;
		private world: Matter.World;
		public ball: Matter.Body;
		public paddle1: Matter.Body;
		public paddle2: Matter.Body;
		private player1ready: boolean = false;
		private player2ready: boolean = false;
		public score: { player1: number, player2: number } = { player1: 0, player2: 0 };
		public speed: number = INIT_BALL_SPEED;
		public inactive = false;
		public toRemove = false;
		loop: NodeJS.Timeout;

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

			Body.setVelocity(this.ball, this.getNewStart(GAME_WIDTH, GAME_HEIGHT).velocity);

			World.add(this.world, [this.ball, this.paddle1, this.paddle2]);
			player1.on('sendPaddleState', (state) => {
				const paddleState = JSON.parse(state);

				const x = paddleState.x;
				const y = paddleState.y;

				Body.setPosition(this.paddle1, { x, y });

				const opponentPaddleState = {
					x: this.paddle2.position.x,
					y: this.paddle2.position.y
				};

				player2.emit('updateOpponentPaddleState', JSON.stringify(opponentPaddleState));
			});

			player2.on('sendPaddleState', (state) => {
				const paddleState = JSON.parse(state);

				const x = paddleState.x;
				const y = paddleState.y;

				Body.setPosition(this.paddle2, { x, y });

				const opponentPaddleState = {
					x: this.paddle1.position.x,
					y: this.paddle1.position.y
				};

				player1.emit('updateOpponentPaddleState', JSON.stringify(opponentPaddleState));
			});
			
			player1.on('disconnect', () => {
				player2.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: true }));
				this.score.player1 = 0;
				this.score.player2 = 1;
				this.stopGame();
			});

			player2.on('disconnect', () => {
				player1.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: true }));
				this.score.player1 = 1;
				this.score.player2 = 0;
				this.stopGame();
			});
			
			setTimeout(() => {
				player1.emit('changeState', JSON.stringify({ gameState: 'playing', playerNumber: 1 }));
				player2.emit('changeState', JSON.stringify({ gameState: 'playing', playerNumber: 2 }));
			}, 1000);
			player1.on('ready', () => {
				this.player1ready = true;
				if (this.player2ready)
					this.startGame();
				else
					player1.emit('waiting');
			});

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
	/*
	 * This function is called when a collision between the ball and a paddle is detected.
	 * It calculates the new velocity of the ball based on the angle of the collision.
	 */
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
	/*
	 * This function is called when a player wins the game.
	 * It sends a message to the players to notify them of the win.
	 */
	private setPlayerWin(player: PlayerNumber) {
		if (player === PlayerNumber.One) {
			this.player1.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: true }));
			this.player2.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: false }));
		}
		else {
			this.player1.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: false }));
			this.player2.emit('changeState', JSON.stringify({ gameState: 'finished', isWin: true }));
		}
	}

	/*
	 * This function is called when a player scores a point
	 */

	private	updateScore() {
		this.player1.emit('updateScore', JSON.stringify(this.score));
		this.player2.emit('updateScore', JSON.stringify(this.score));
	}
	/*
	 * This function is called when a player leaves the game.
	 * It stops the game and removes the players from the game.
	 */

	private stopGame() {
		World.remove(this.world, [this.ball, this.paddle1, this.paddle2]);
		World.clear(this.world, false);
		Engine.clear(this.engine);
		clearInterval(this.loop);
		this.player1.removeAllListeners();
		this.player2.removeAllListeners();
		this.inactive = true;
	}

	/*
	 * This function is called when both players are ready to play.
	 * It starts the game and sets up the event listeners.
	 */

	private startGame() {
		this.engine.velocityIterations = 10;
		this.engine.positionIterations = 10;

		this.loop = setInterval(() => {
			Engine.update(this.engine, 1000 / 60);
		}, 1000 / 60);

		Events.on(this.engine, 'collisionStart', (event) => {
			const pairs = event.pairs[0]
			if (pairs.bodyA === this.ball)
				this.handleBallPaddleCollision(pairs.bodyB);
			else
				this.handleBallPaddleCollision(pairs.bodyA);
		})

		Events.on(this.engine, 'afterUpdate', () => {
			if (this.ball.position.x < -50) {
				this.score.player2++;
				this.updateScore();
				if (this.score.player2 == 5) {
					this.setPlayerWin(PlayerNumber.Two);
					this.stopGame();
				}
				else
					this.resetBall();
			}
			else if (this.ball.position.x > GAME_WIDTH + 50) {
				this.score.player1++;
				this.updateScore();
				if (this.score.player1 == 5) {
					this.setPlayerWin(PlayerNumber.One);
					this.stopGame();
				}
				else
					this.resetBall();
			}
			if ((this.ball.velocity.y > 0 && this.ball.position.y + BALL_RADIUS >= GAME_HEIGHT - 10) ||
				(this.ball.velocity.y < 0 && this.ball.position.y - BALL_RADIUS <= 10)) {
				const velocity = this.ball.velocity;
				velocity.y = -velocity.y;
				Body.setVelocity(this.ball, velocity);
			}
			this.sendBallState();
		});
	}

	/*
	 This function is called to reset the ball position and velocity.
	 */

	private resetBall() {
		Body.setPosition(this.ball, BALL_POSITION);
		Body.setVelocity(this.ball, { x: INIT_BALL_SPEED, y: INIT_BALL_SPEED });
		this.speed = INIT_BALL_SPEED;
	}

	/*
	 * This function is called to send the ball position to the players.
	 * This function keeps running for every ball movement
	 */

	private sendBallState() {
		const ballState = {
			position: {
				x: this.ball.position.x,
				y: this.ball.position.y
			}
		};

		this.player1.emit('updateBallState', ballState);
		this.player2.emit('updateBallState', ballState);
	}

	/*
	 * This function is called to generate a random start position and velocity for the ball.
	 */

	public getNewStart(gameWidth: number, gameHeight: number) {
		this.speed = INIT_BALL_SPEED;
		const angle = Common.random(-MAX_ANGLE, MAX_ANGLE);
		const angleRad = angle * Math.PI / 180;

		const directionX = Common.choose([1, -1]) * Math.cos(angleRad);
		const directionY = Common.choose([1, -1]) * Math.sin(angleRad);

		const velocity = {
			x: directionX * this.speed,
			y: directionY * this.speed,
		};

		const position = {
			x: gameWidth / 2,
			y: gameHeight / 2,
		};

		return { velocity, position };
	}
}

