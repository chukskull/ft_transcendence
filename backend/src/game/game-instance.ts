import { Server } from 'socket.io';
import { GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH, DIST_WALL_TO_PADDLE } from './game.service';

const BASE_BALL_SPEED = 2;
const FRAME_RATE = 1000 / 20;
const BALL_SPEED = Math.floor(BASE_BALL_SPEED * FRAME_RATE / 16.66666);


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
  public gameEnded: boolean;
  public winnerID: number;
  private server: Server;

  // first and second are taken from the queue (player: {id, socket}) and server is the socket server
  constructor(first: any, second: any, server: Server) {
    console.log('game created')
    this.player1 = first;
    this.player2 = second;
    this.ball = { x: 417, y: 240, speedX: BALL_SPEED, speedY: BALL_SPEED };
    this.player1Score = this.player1.score; // undefined
    this.player2Score = this.player2.score; // undefined
    this.gameRunning = false;
    this.gameEnded = false;
    this.server = server;
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
    console.log('game started')
    this.gameRunning = true;
    this.player1.socket.on('positionUpdate', (data) => {
      this.paddle1Position = data.player1PaddleY;
    });
    this.player2.socket.on('positionUpdate', (data) => {
      this.paddle2Position = data.player1PaddleY;
    });
        
    // handle disconnect
    this.player1.socket.on('disconnect', () => {
      this.player1Score = 0;
      this.player2Score = 5;
      this.winnerID = this.player2.id;
      this.server.to('gameStart' + this.player2.id).emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.server.to('gameStart' + this.player1.id).emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.server.to('gameStart' + this.player2.id).emit('gameEnded', {
        winner: this.winnerID,
      });
      this.gameRunning = false;
      this.gameEnded = true;
    });
    this.player2.socket.on('disconnect', () => {
      this.player1Score = 5;
      this.player2Score = 0;
      this.winnerID = this.player1.id;
      this.server.to('gameStart' + this.player2.id).emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.server.to('gameStart' + this.player1.id).emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.server.to('gameStart' + this.player2.id).emit('gameEnded', {
        winner: this.winnerID,
      });
      this.gameRunning = false;
      this.gameEnded = true;
    });
    
    
    this.gameLoop = setInterval(() => {
      if (this.gameRunning && !this.gameEnded) {
        // emit positions
        this.emitPositions();
        // call the math function
        this.updateGame();
      }
    }, FRAME_RATE);
  }
  public updateGame(): void {
    // check collision with left and right walls
    this.updateScore();
    if (this.gameEnded && !this.gameRunning)
      this.endGame();
    // check collision with top and bottom walls
    this.bounceOffTopAndBottomWalls();
    // check collision with players paddles
    this.bounceOffPaddles();
    // move ball
    this.moveBall();
  }

  public endGame() {
    this.player1.socket.disconnect();
    this.player2.socket.disconnect();
    clearInterval(this.gameLoop);
  }

  public emitPositions(): void {
    this.player1.socket.emit('roomPostions', {
      ballX: this.ball.x,
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
  }

  
  public resetBall(): boolean {
    this.player1.socket.emit('sendBallState', this.ball);
    this.player2.socket.emit('sendBallState', this.ball);
    this.ball = { x: 417, y: 240, speedX: BALL_SPEED, speedY: BALL_SPEED };
    return true
  }

  public moveBall(): void {
    this.ball.x += this.ball.speedX;
    this.ball.y += this.ball.speedY;
  }
  public updateScore(): void {
    // check collision with right and left walls
    const hitRightEdge = this.ball.x > GAME_WIDTH - PADDLE_WIDTH
    const hitLeftEdge = this.ball.x <= 5

    if (hitRightEdge || hitLeftEdge) {
      this.player1Score += hitLeftEdge ? 1 : 0;
      this.player2Score += hitRightEdge ? 1 : 0;
      this.resetBall();
      if (this.checkGameEnd()) {
        this.server.to('gameStart' + this.player1.id).emit('gameEnded', {
          winner: this.winnerID,
        });
        this.server.to('gameStart' + this.player2.id).emit('gameEnded', {
          winner: this.winnerID,
        });
        this.gameEnded = true;
        this.gameRunning = false;
      }
      this.server.to('gameStart' + this.player1.id).emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.server.to('gameStart' + this.player2.id).emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
    }
  }

  public bounceOffTopAndBottomWalls(): void {
    // check collision with top and bottom walls
    if (this.ball.y + this.ball.speedY > GAME_HEIGHT - 15 || this.ball.y + this.ball.speedY < 15) {
      this.ball.speedY = -this.ball.speedY;
    }
  }

  public bounceOffPaddles(): void {
    const hitLeftPaddle = this.ball.x <= DIST_WALL_TO_PADDLE && this.ball.y >= this.paddle1Position && this.ball.y <= this.paddle1Position + PADDLE_HEIGHT
    const hitRightPaddle = this.ball.x >= GAME_WIDTH - DIST_WALL_TO_PADDLE - PADDLE_WIDTH - BALL_RADIUS && this.ball.y >= this.paddle2Position && this.ball.y <= this.paddle2Position + PADDLE_HEIGHT
    if ( hitLeftPaddle && this.ball.speedX < 0 || hitRightPaddle && this.ball.speedX > 0) {
      this.ball.speedX = -this.ball.speedX;
    }
  }

  // check game end
  public checkGameEnd(): boolean {
    if (this.player1Score === 5) {
      this.winnerID = this.player1.id;
      return true;
    } else if (this.player2Score === 5) {
      this.winnerID = this.player2.id;
      return true;
    } else
      return false;
  }
}
