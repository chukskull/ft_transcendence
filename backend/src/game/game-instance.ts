import { Server, Socket } from 'socket.io';
import { GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH, DIST_WALL_TO_PADDLE } from './game.service';


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
  public player1: any;
  public player2: any;
  public player1Score: number;
  public player2Score: number;
  public ball: { x: number; y: number; speedX: number; speedY: number };
  private paddle1Position: number;
  private paddle2Position: number;
  private gameLoop: NodeJS.Timeout;
  public gameRunning: boolean;
  private gameEnded: boolean;
  public winnerID: number;

  // first and second are taken from the queue (player: {id, socket}) and server is the socket server
  constructor(first: any, second: any, server: Server) {
    this.player1 = first;
    this.player2 = second;
    this.ball = { x: 417, y: 240, speedX: 2, speedY: 2 };
    this.player1Score = this.player1.score;
    this.player2Score = this.player2.score;
    this.gameRunning = false;
    this.gameEnded = false;
    this.positionsStruct = {
      //starting data
      ballx: this.ball.x, //default
      bally: this.ball.y, //default
      player1Score: 0, //default
      player2Score: 0, //default
      paddle1YPosition: 210, //default
      paddle2YPosition: 210, //default
    };
  }

  public startGame(): void {
    this.gameRunning = true;
    this.player1.socket.on('positionUpdate', (data) => {
      this.paddle1Position = data.player1PaddleY;
    });
    this.player2.socket.on('positionUpdate', (data) => {
      this.paddle2Position = data.player1PaddleY;
    });
        
    // handle disconnect
    this.player1.socket.on('disconnect', () => {
      this.endGame();
    });
    this.player2.socket.on('disconnect', () => {
      this.endGame();
    });
    this.gameLoop = setInterval(() => {
      if (this.gameRunning && !this.gameEnded) {
        this.player1.socket.emit('roomPostions', {
          ballX: this.ball.x, // undefined
          ballY: this.ball.y,
          player1Score: this.player1Score,
          player2Score: this.player2Score,
          enemyY: this.paddle2Position,
        });
        this.player2.socket.emit('roomPostions', {
          ballX: GAME_WIDTH - this.ball.x,
          ballY: this.ball.y,
          player1Score: this.player2Score,
          player2Score: this.player1Score,
          enemyY: this.paddle1Position,
        });

        // call the math function
        this.updateBall();
        // console.log(this.ball); // checking whether update goes well
      }
    }, 1000 / 60);
  }
  public updateBall(): void {

    const hitRightEdge = this.ball.x > GAME_WIDTH - PADDLE_WIDTH
    const hitLeftEdge = this.ball.x <= 5

    if (hitRightEdge || hitLeftEdge) {
      this.player1Score += hitLeftEdge ? 1 : 0;
      this.player2Score += hitRightEdge ? 1 : 0;
      this.player1.socket.emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.player2.socket.emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.resetBall();
      // check game over
      if (this.player1Score >= 5) {
        this.winnerID = this.player1.id;
        this.endGame();
      }

      if (this.player2Score >= 5) {
        this.winnerID = this.player2.id;
        this.endGame();
      }
    }

    // check collision with top and bottom walls
    if (this.ball.y + this.ball.speedY > GAME_HEIGHT - 15 || this.ball.y + this.ball.speedY < 15) {
      this.ball.speedY = -this.ball.speedY;
    }

    // check collision with players paddles
    const hitLeftPaddle = this.ball.x <= DIST_WALL_TO_PADDLE && this.ball.y >= this.paddle1Position && this.ball.y <= this.paddle1Position + PADDLE_HEIGHT
    const hitRightPaddle = this.ball.x >= GAME_WIDTH - DIST_WALL_TO_PADDLE - PADDLE_WIDTH - BALL_RADIUS && this.ball.y >= this.paddle2Position && this.ball.y <= this.paddle2Position + PADDLE_HEIGHT
    if ( hitLeftPaddle && this.ball.speedX < 0 || hitRightPaddle && this.ball.speedX > 0) {
      this.ball.speedX = -this.ball.speedX;
    }

    // move ball
    this.ball.x += this.ball.speedX;
    this.ball.y += this.ball.speedY;
  }
  public endGame(): void {
    this.gameEnded = true;
    this.gameRunning = false;
    this.player1.socket.disconnect();
    this.player2.socket.disconnect();
    clearInterval(this.gameLoop);
  }
  public resetBall(): void {
    this.updateScore();
    this.player1.socket.emit('sendBallState', this.ball);
    this.player2.socket.emit('sendBallState', this.ball);
    this.ball = { x: 417, y: 240, speedX: 2, speedY: 2 };
  }
  public updateScore(): void {
    this.player1.socket.on('updateScore', (score) => {
      this.player1Score = score;
    });
    this.player2.socket.on('updateScore', (score) => {
      this.player2Score = score;
    });
  }
}
