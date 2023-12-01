import { Socket } from 'socket.io';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BALL_RADIUS,
  PADDLE1_POSITION,
  PADDLE2_POSITION,
} from './game.service';

export class GameInstance {
  public positionsStruct: {
    //starting data
    ballx: number; //default
    bally: number; //default
    player1Score: number; //default
    player2Score: number; //default
    paddle1YPosition: number; //default
    paddle2YPosition: number; //default
  };
  public player1: Socket;
  public player2: Socket;
  public player1Score: number;
  public player2Score: number;
  public ball: { x: number; y: number; speedX: number; speedY: number };
  private paddle1Position: number;
  private paddle2Position: number;
  private gameLoop: NodeJS.Timeout;
  public gameRunning: boolean;
  private gameEnded: boolean;
  public winnerID: number;

  //   take user from queue bcs user in queue has the .id to update data in MH , .Socket to send data to front
  constructor(socket1: Socket, socket2: Socket) {
    this.player1 = socket1;
    this.player2 = socket2;
    this.player1Score = 0;
    this.player2Score = 0;
    this.ball = { x: 417, y: 240, speedX: 2, speedY: 2 };
    this.paddle1Position = PADDLE1_POSITION;
    this.paddle2Position = PADDLE2_POSITION;
    this.gameRunning = false;
    this.gameEnded = false;
  }

  public startGame(): void {
    this.gameRunning = true;
    this.positionsStruct = {
      //starting data
      ballx: 417, //default
      bally: 240, //default
      player1Score: 0, //default
      player2Score: 0, //default
      paddle1YPosition: 215, //default
      paddle2YPosition: 215, //default
    };
    this.gameLoop = setInterval(() => {
      if (this.gameRunning && !this.gameEnded) {
        this.player1.on('positionUpdate', (data) => {
          this.paddle1Position = data;
        });
        this.player2.on('positionUpdate', (data) => {
          this.paddle2Position = data;
        });
        this.player1.emit('roomPostions' + 1, {
          ballX: this.ball.x,
          ballY: this.ball.y,
          player1Score: this.player1Score,
          player2Score: this.player2Score,
          enemyY: this.paddle2Position,
        });
        this.player2.emit('roomPostions' + 2, {
          ballX: this.ball.x,
          ballY: this.ball.y,
          player1Score: this.player2Score,
          player2Score: this.player1Score,
          enemyY: this.paddle1Position,
        });

        // call the math function
        // calculate_movement();
      }
    }, 1000 / 60);
  }

  public endGame(): void {
    this.gameEnded = true;
    this.gameRunning = false;
    this.player1.disconnect();
    this.player2.disconnect();
    clearInterval(this.gameLoop);
  }

  public updateBall(prevBall): void {
    prevBall = this.ball;
    const paddle1Position = this.paddle1Position;
    const paddle2Position = this.paddle2Position;

    // Move ball
    prevBall.x += prevBall.speedX;
    prevBall.y += prevBall.speedY;

    // Bounce off top and bottom edges
    if (
      prevBall.y + prevBall.speedY > GAME_HEIGHT - BALL_RADIUS ||
      prevBall.y + prevBall.speedY < BALL_RADIUS
    )
      prevBall.speedY = -prevBall.speedY;
    // Bounce off paddles
    else if (
      prevBall.x + prevBall.speedX > GAME_WIDTH - 13 ||
      (prevBall.x + prevBall.speedX < 25 &&
        prevBall.y >= paddle1Position &&
        prevBall.y <= paddle1Position + 110) ||
      prevBall.x + prevBall.speedX < 13 ||
      (prevBall.x + prevBall.speedX > 775 &&
        prevBall.y >= paddle2Position &&
        prevBall.y <= paddle2Position + 110)
    ) {
      const increasedSpeed = -prevBall.speedX;
      prevBall.speedX = increasedSpeed;
    }

    // Score
    if (prevBall.x < 0) {
      this.player2Score++;
      this.resetBall();
    } else if (prevBall.x > GAME_WIDTH) {
      this.player1Score++;
      this.resetBall();
    }
  }

  public resetBall(): void {
    this.updateScore();
    this.player1.emit('sendBallState', this.ball);
    this.player2.emit('sendBallState', this.ball);
    this.ball = { x: 417, y: 240, speedX: 2, speedY: 2 };
  }

  public updateScore(): void {
    this.player1.on('updateScore', (score) => {
      this.player1Score = score;
    });
    this.player2.on('updateScore', (score) => {
      this.player2Score = score;
    });
  }
}
