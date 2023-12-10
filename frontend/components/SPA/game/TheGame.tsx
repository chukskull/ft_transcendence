import React, { useState, useEffect, use } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import io from "socket.io-client";

type Score = {
  player: number;
  ai: number;
};

const DIST_WALL_TO_PADDLE = 20;
const PADDLE_HEIGHT = 110;
const PADDLE_WIDTH = 13;
const BALL_RADIUS = 16;

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

    speedX: 2,
    speedY: 2,
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
          ai: hitLeftEdge ? prev.ai + 1 : prev.ai
        }));
        console.log("=> 3");

        setBall({
          x: 417,
          y: 240,
          speedX: 3,
          speedY: 3,
        });
        console.log("=> 4");
        return;
      }

      // return;
      // }

      // Ball collisions with top and bottom walls
      if (
        ball.y + ball.speedY > canvasHeight - 15 ||
        ball.y + ball.speedY < -3
      ) {
        setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
        // console.log("=> 5");
      }

      // Ball collisions with paddle
      const hitRightPaddle = ball.x >= canvasWidth - (PADDLE_WIDTH + DIST_WALL_TO_PADDLE + BALL_RADIUS);
      const hitLeftPaddle = ball.x <= DIST_WALL_TO_PADDLE && ball.y >= playerPaddleY && ball.y <= playerPaddleY + PADDLE_HEIGHT;
      if (hitLeftPaddle || hitRightPaddle) {
        // Increase ball speed on paddle collision
        console.log(`{hitLeftPaddle: ${hitLeftPaddle}, hitRightPaddle: ${hitRightPaddle}}, {ball.speedX: ${ball.speedX}}`)
        if ((hitLeftPaddle && ball.speedX < 0) || (hitRightPaddle && ball.speedX >= 0)) {
          console.log(` changed ===> {hitLeftPaddle: ${hitLeftPaddle}, hitRightPaddle: ${hitRightPaddle}}, {ball.speedX: ${ball.speedX}}`)
          if (ball.speedX * ball.speedX < 81) {
            const increasedSpeedX = -ball.speedX * 1.2; // Increase speed by a factor (e.g., 1.05)
            setBall((prevBall) => ({ ...prevBall, speedX: increasedSpeedX }));
            console.log("=> 6");
          } else {
            setBall((prevBall) => ({ ...prevBall, speedX: -ball.speedX }));
            console.log("=> 7");
          }
        }
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
        x: prevBall.x + (hitLeftPaddle || hitRightPaddle ? (hitLeftPaddle ? 0.3 : -0.3) * BALL_RADIUS : prevBall.speedX),
        y: prevBall.y + prevBall.speedY,
      }));
      // ball.speedX * ball.speedX >= 55 && console.log(`=> 8 {ball.x: ${ball.x} hitLeftPaddle: ${hitLeftPaddle}, hitRightPaddle: ${hitRightPaddle}}`);
    };

    const gameInterval = setInterval(gameLoop, 17 ); // Prblem appears only when the debugger is of (not sure why) => the higher less the problem
    /**
     * I guess the problem is setting state is async and sometimes it skips the state where it hit the paddle
     */

    return () => {
      clearInterval(gameInterval);
    };
  }, [ball.x, ball.y, gameStarted]);

  useEffect(() => {
    // handle ai paddle
    if (!gameStarted) {
      return;
    }

    // Update AI paddle position based on ball's y-coordinate
    if (EnemyPaddleY + 40 < ball.y && EnemyPaddleY + PADDLE_HEIGHT < canvasHeight) {
      setEnemyPaddleY(EnemyPaddleY + 4);
    } else if (EnemyPaddleY + 40 > ball.y && EnemyPaddleY > 5) {
      setEnemyPaddleY(EnemyPaddleY - 4);
    }

  }, [gameStarted, ball.y, EnemyPaddleY]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    // handle player paddle
    if (keys["ArrowDown"] && playerPaddleY + PADDLE_HEIGHT < canvasHeight) {
      setPlayerPaddleY(playerPaddleY + 12);
    } else if (keys["ArrowUp"] && playerPaddleY > 5) {
      setPlayerPaddleY(playerPaddleY - 12);
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
