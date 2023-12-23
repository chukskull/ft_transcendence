import { Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { AchievementService } from 'src/achievement/achievement.service';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  DIST_WALL_TO_PADDLE,
} from './game.service';

const BASE_BALL_SPEED = 4;
const FRAME_RATE = 1000 / 20;
const BALL_SPEED = Math.floor((BASE_BALL_SPEED * FRAME_RATE) / 16.66666);

export class GameInstance {
  public positionsStruct: {
    ballx: number;
    bally: number;
    player1Score: number;
    player2Score: number;
    paddle1YPosition: number;
    paddle2YPosition: number;
  };
  public userServ: UserService;
  public achievementService: AchievementService;
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
  public matchHistory: any;
  public matchHistoryRepo: any;

  constructor(
    first: any,
    second: any,
    server: Server,
    matchHistory: any,
    matchHistoryRepo: any,
    achievService: any,
  ) {
    this.achievementService = achievService;

    this.matchHistory = matchHistory;
    this.matchHistoryRepo = matchHistoryRepo;
    this.player1 = first;
    this.player2 = second;
    this.ball = { x: 417, y: 240, speedX: BALL_SPEED, speedY: BALL_SPEED };
    this.player1Score = this.player1.score;
    this.player2Score = this.player2.score;
    this.gameRunning = false;
    this.gameEnded = false;
    this.server = server;
    this.positionsStruct = {
      //starting data
      ballx: this.ball.x,
      bally: this.ball.y,
      player1Score: 0,
      player2Score: 0,
      paddle1YPosition: 210,
      paddle2YPosition: 210,
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
      this.player2Score = 5;
      this.winnerID = this.player2.id;
      this.player2.socket.emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.player1.socket.emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.player2.socket.emit('gameEnded', {
        winner: this.winnerID,
      });
      this.gameRunning = false;
      this.gameEnded = true;
      this.updateScoreInDB();
    });
    this.player2.socket.on('disconnect', () => {
      this.player1Score = 5;
      this.winnerID = this.player1.id;
      this.player2.socket.emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.player1.socket.emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.player1.socket.emit('gameEnded', {
        winner: this.winnerID,
      });
      this.gameRunning = false;
      this.gameEnded = true;
      this.updateScoreInDB();
    });

    this.gameLoop = setInterval(() => {
      if (this.gameRunning && !this.gameEnded) {
        // emit Ball positions
        this.emitBallPositions();
        // emit enemy paddle position
        this.emitEnemyPaddlePosition();
        // call the math function
        this.updateGame();
      } else if (this.gameEnded) {
        this.endGame();
      }
    }, FRAME_RATE);
  }
  public updateGame(): void {
    // check collision with left and right walls
    this.updateScore();
    // check collision with top and bottom walls
    this.bounceOffTopAndBottomWalls();
    // check collision with players paddles
    this.bounceOffPaddles();
    // move ball
    this.moveBall();
  }

  public endGame() {
    this.updateScoreInDB();
    clearInterval(this.gameLoop);
    this.player1.socket.removeAllListeners();
    this.player2.socket.removeAllListeners();
    this.player1.socket.leave('gameStart' + this.player1.id);
    this.player2.socket.leave('gameStart' + this.player2.id);
  }

  public emitBallPositions(): void {
    this.player1.socket.emit('roomPostions', {
      ballX: this.ball.x,
      ballY: this.ball.y,
    });
    this.player2.socket.emit('roomPostions', {
      ballX: GAME_WIDTH - this.ball.x,
      ballY: this.ball.y,
    });
  }

  public emitEnemyPaddlePosition(): void {
    this.player1.socket.emit('enemyPositionUpdate', {
      enemyY: this.paddle2Position,
    });
    this.player2.socket.emit('enemyPositionUpdate', {
      enemyY: this.paddle1Position,
    });
  }

  public resetBall(): boolean {
    this.player1.socket.emit('sendBallState', this.ball);
    this.player2.socket.emit('sendBallState', this.ball);
    this.ball = {
      x: 417,
      y: 240,
      speedX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      speedY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    };
    return true;
  }

  public moveBall(): void {
    this.ball.x += this.ball.speedX;
    this.ball.y += this.ball.speedY;
  }
  public updateScore(): void {
    // check collision with right and left walls
    const hitRightEdge = this.ball.x > GAME_WIDTH - PADDLE_WIDTH;
    const hitLeftEdge = this.ball.x <= 5;

    if (hitRightEdge || hitLeftEdge) {
      this.player1Score += hitRightEdge ? 1 : 0;
      this.player2Score += hitLeftEdge ? 1 : 0;
      this.player1.socket.emit('updateScore', {
        player1: this.player1Score,
        player2: this.player2Score,
      });
      this.player2.socket.emit('updateScore', {
        player1: this.player2Score,
        player2: this.player1Score,
      });
      this.resetBall();
      if (this.checkGameEnd()) {
        if (this.player1Score === 5) {
          this.winnerID = this.player1.id;
          this.player1.socket.emit('gameEnded', {
            winner: this.player1.nickName,
            loser: this.player2.nickName,
            player1Score: this.player1Score,
            player2Score: this.player2Score,
          });
          this.player2.socket.emit('gameEnded', {
            winner: this.player1.nickName,
            loser: this.player2.nickName,
            player1Score: this.player2Score,
            player2Score: this.player1Score,
          });
        }
        if (this.player2Score === 5) {
          this.winnerID = this.player2.id;
          this.player1.socket.emit('gameEnded', {
            winner: this.player2.nickName,
            loser: this.player1.nickName,
            player1Score: this.player1Score,
            player2Score: this.player2Score,
          });
          this.player2.socket.emit('gameEnded', {
            winner: this.player2.nickName,
            loser: this.player1.nickName,
            player1Score: this.player2Score,
            player2Score: this.player1Score,
          });
        }
        this.gameEnded = true;
        this.gameRunning = false;
        this.endGame();
      }
    }
  }

  private async updateScoreInDB() {
    try {
      const matchHistory = await this.matchHistory
      if (matchHistory) {
        await this.matchHistoryRepo.update(
          {
            id: matchHistory.id,
          },
          {
            player1Score: this.player1Score,
            player2Score: this.player2Score,
            winner: this.winnerID,
          }
        );
  
        await this.achievementService.calculateAchievement(
          this.player1.id,
          this.player2.id,
          matchHistory.id
        );
      } else {
        console.log('Match history not found');
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  }

  public bounceOffTopAndBottomWalls(): void {
    // check collision with top and bottom walls
    if (this.ball.y >= GAME_HEIGHT - 15 || this.ball.y <= 0) {
      this.ball.speedY = -this.ball.speedY;
    }
  }

  public bounceOffPaddles(): void {
    const hitRightPaddle =
      this.ball.x >= GAME_WIDTH - (DIST_WALL_TO_PADDLE + PADDLE_WIDTH) &&
      this.ball.y >= this.paddle2Position &&
      this.ball.y <= this.paddle2Position + PADDLE_HEIGHT;
    const hitLeftPaddle =
      this.ball.x <= DIST_WALL_TO_PADDLE + PADDLE_WIDTH &&
      this.ball.y >= this.paddle1Position &&
      this.ball.y <= this.paddle1Position + PADDLE_HEIGHT;
    if (
      (hitLeftPaddle && this.ball.speedX < 0) ||
      (hitRightPaddle && this.ball.speedX > 0)
    ) {
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
    } else return false;
  }
}
