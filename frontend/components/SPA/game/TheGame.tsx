import React, { useState, useEffect, use } from "react";
import style from "@/styles/SPA/game/game.module.scss";

type Score = {
  player: number;
  ai: number;
};

const DIST_WALL_TO_PADDLE = 20;
const PADDLE_HEIGHT = 110;
const PADDLE_WIDTH = 13;
const ENEMY_PADDLE_SPEED = 5;
const BALL_RADIUS = 16;
const PLAYER_PADDLE_SPEED = 15;

const useKeyHandler = () => {
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const handleKeyDown = (e: KeyboardEvent) => {
    setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
};

export default function TheGame({ map }: { map: string }) {
  const [gameStarted, setGameStarted] = useState(false);
  const canvasWidth: number = 860;
  const canvasHeight: number = 500;
  const [score, setScore] = useState<Score>({ player: 0, ai: 0 });
  const [ball, setBall] = useState({
    x: 417,
    y: 240,

    speedX: 6,
    speedY: 6,
  });
  const [playerPaddleY, setPlayerPaddleY] = useState(210);
  const [EnemyPaddleY, setEnemyPaddleY] = useState(210);

  const keys = useKeyHandler();

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const gameLoop = () => {
      // Check for ball going out of left/right walls
      const hitRightEdge = ball.x > canvasWidth - PADDLE_WIDTH;
      const hitLeftEdge = ball.x <= 5;

      if (hitRightEdge || hitLeftEdge) {
        setScore((prev) => ({
          ...prev,
          player: hitRightEdge ? prev.player + 1 : prev.player,
          ai: hitLeftEdge ? prev.ai + 1 : prev.ai,
        }));

        setBall({
          x: 417,
          y: 240,
          speedX: 6,
          speedY: 6,
        });
        if (score.player === 5 || score.ai === 5) {
          setScore({ player: 0, ai: 0 });
          setGameStarted(false);
          return;
        }
        return;
      }

      // return;
      // }

      // Ball collisions with top and bottom walls
      if (
        ball.y + ball.speedY > canvasHeight - 5 ||
        ball.y + ball.speedY < -3
      )
        setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
      // Ball collisions with paddle
      const hitRightPaddle =
        ball.x >=
        canvasWidth - (PADDLE_WIDTH + DIST_WALL_TO_PADDLE + BALL_RADIUS);
      const hitLeftPaddle =
        ball.x <= DIST_WALL_TO_PADDLE + PADDLE_WIDTH &&
        ball.y >= playerPaddleY &&
        ball.y <= playerPaddleY + PADDLE_HEIGHT;
      if (hitLeftPaddle || hitRightPaddle) {
        // Reverse ball direction on paddle collision
        if (
          (hitLeftPaddle && ball.speedX < 0) ||
          (hitRightPaddle && ball.speedX >= 0)
        )
          setBall((prevBall) => ({ ...prevBall, speedX: -prevBall.speedX }));
      }

      /**
       *
       * Looks like the reason the ball is bouncing before hitting the paddle  is because of setting the ball x position to a big value or small value using speedX
       * hitLeftPadlle can be triggered multiple times ater the first hit because the condition is true for multiple frames
       * thus we should check first if the ball has already hit (by checking the speedX sign)
       */
      // Ball movement
      setBall((prevBall) => ({
        ...prevBall,
        x:
          prevBall.x +
          (hitLeftPaddle || hitRightPaddle
            ? (hitLeftPaddle ? 0.1 : -0.1) * BALL_RADIUS
            : prevBall.speedX),
        y: prevBall.y + prevBall.speedY,
      }));
      // ball.speedX * ball.speedX >= 55 && console.log(`=> 8 {ball.x: ${ball.x} hitLeftPaddle: ${hitLeftPaddle}, hitRightPaddle: ${hitRightPaddle}}`);
    };

    const gameInterval = setInterval(gameLoop, 17); // Prblem appears only when the debugger is of (not sure why) => the higher less the problem
    /**
     * I guess the problem is setting state is async and sometimes it skips the state where it hit the paddle
     */

    return () => {
      clearInterval(gameInterval);
    };
  }, [ball.x, ball.y, gameStarted]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }
    // Update AI paddle position based on ball's y-coordinate
    if (
      EnemyPaddleY + 40 < ball.y &&
      EnemyPaddleY + PADDLE_HEIGHT < canvasHeight - 5
    )
      setEnemyPaddleY(EnemyPaddleY + ENEMY_PADDLE_SPEED)
    else if (EnemyPaddleY + 40 > ball.y && EnemyPaddleY > 5)
      setEnemyPaddleY(EnemyPaddleY - ENEMY_PADDLE_SPEED);
  }, [gameStarted, ball.y, EnemyPaddleY]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    // handle player paddle
    if (keys["ArrowDown"] && (playerPaddleY + PADDLE_HEIGHT) + PLAYER_PADDLE_SPEED <= canvasHeight - 5) {
      setPlayerPaddleY(playerPaddleY + PLAYER_PADDLE_SPEED);
    } else if (keys["ArrowUp"] && playerPaddleY > 0) {
      setPlayerPaddleY(playerPaddleY - PLAYER_PADDLE_SPEED);
    }
  }, [gameStarted, keys]);

  const handleStartGame = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " ") {
      setGameStarted(!gameStarted);
    }
  };
  return (
    <div className={style.gameBody} onKeyDown={handleStartGame} tabIndex={0}>
      <p>{score.player}</p>
      {!gameStarted && (
        <h3>
          Press SPACE <br />
          to start the game
        </h3>
      )}
      <div className={style[`${map}`]} tabIndex={0}>
        <div className={style.middleLine} />
        <div className={style.player} style={{ top: playerPaddleY }}></div>
        <div className={style.ai} style={{ top: EnemyPaddleY }}></div>
        <div
          className={style.ball}
          style={{
            top: ball.y,
            left: ball.x,
          }}
        ></div>
      </div>
      <p>{score.ai}</p>
    </div>
  );
}
