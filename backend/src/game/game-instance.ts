import { Socket } from 'socket.io';
import {
	GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, INIT_BALL_SPEED, PADDLE1_POSITION, PADDLE2_POSITION, PlayerNumber
} from './game.service';


export class GameInstance {
	private player1: Socket;
	private player2: Socket;
	private player1Score: number;
	private player2Score: number;
	public	ball: {x: number, y: number, speedX: number, speedY: number};
	private paddle1Position : number
	private paddle2Position: number
	private gameLoop: NodeJS.Timeout;
	public	gameRunning: boolean;
	private gamePaused: boolean;
	private gameEnded: boolean;

	constructor(socket1: Socket, socket2: Socket) {
		this.player1 = socket1;
		this.player2 = socket2;
		this.player1Score = 0;
		this.player2Score = 0;
		this.ball = {x: 417, y: 240, speedX: 2, speedY: 2}
		this.paddle1Position = PADDLE1_POSITION;
		this.paddle2Position = PADDLE2_POSITION;
		this.gameRunning = false;
		this.gamePaused = false;
		this.gameEnded = false;
	}

	public startGame(): void {
		this.gameRunning = true;
		this.gameLoop = setInterval(() => {
			if (this.gameRunning && !this.gamePaused && !this.gameEnded) {
				const prevBall = { ...this.ball };
				this.updateBall(prevBall);
				this.updatePaddle();
				this.player1.emit('sendBallState', this.ball);
				this.player2.emit('sendBallState', this.ball);
			}
		}, 1000 / 60);
	}

	public pauseGame(): void {
		this.gamePaused = true;
	}

	public resumeGame(): void {
		this.gamePaused = false;
	}

	public endGame(): void {
		this.gameEnded = true;
		this.gameRunning = false;
		clearInterval(this.gameLoop);
	}

	public updateBall(prevBall): void {
		const ball = this.ball;
		const paddle1Position = this.paddle1Position;
		const paddle2Position = this.paddle2Position;

		// Move ball
		ball.x += ball.speedX;
		ball.y += ball.speedY;

		// Bounce off top and bottom edges
		if (ball.y + ball.speedY > GAME_HEIGHT - BALL_RADIUS || ball.y + ball.speedY < BALL_RADIUS)
			ball.speedY = -ball.speedY;

		// Bounce off paddles
		else if ((ball.x + ball.speedX > GAME_WIDTH - 13 || (ball.x + ball.speedX < 25 && ball.y >= paddle1Position && ball.y <= paddle1Position + 110)) || (ball.x + ball.speedX < 13 || (ball.x + ball.speedX > 775 && ball.y >= paddle2Position && ball.y <= paddle2Position + 110))) {
			const increasedSpeed = -ball.speedX;
			ball.speedX = increasedSpeed;
		}

		// Score
		if (ball.x < 0) {
			this.player2Score++;
			this.resetBall();
		} else if (ball.x > GAME_WIDTH) {
			this.player1Score++;
			this.resetBall();
		}
	}

	public resetBall(): void {
		this.player1.emit('updateScore', this.player1Score);
		this.player2.emit('updateScore', this.player2Score);
		this.player1.emit('sendBallState', this.ball);
		this.player2.emit('sendBallState', this.ball);
		this.ball = {x: 417, y: 240, speedX: 2, speedY: 2};
	}

	public updatePaddle(): void {
		this.player1.on('sendPaddleState', (paddleState) => {
			this.paddle1Position = paddleState;
		});
		this.player2.on('sendPaddleState', (paddleState) => {
			this.paddle2Position = paddleState;
		});
	}
}