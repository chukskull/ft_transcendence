import React, { useState, useEffect} from "react";
import style from "@/styles/SPA/game/game.module.scss";

type Score = {
  player: number;
  ai: number;
};

const DIST_WALL_TO_PADDLE = 20;
const PADDLE_HEIGHT = 110;
const PADDLE_WIDTH = 13;
const BALL_RADIUS = 16;
const PLAYER_PADDLE_SPEED = 16;
const BALL_SPEED = 6;

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
  const canvasWidth: number = 845;
  const canvasHeight: number = 500;
  const [score, setScore] = useState<Score>({ player: 0, ai: 0 });
  const [ball, setBall] = useState({
    x: 417,
    y: 240,

    speedX: BALL_SPEED,
    speedY: BALL_SPEED,
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
      const hitLeftEdge = ball.x < 0;

      if (hitRightEdge || hitLeftEdge) {
        setScore((prev) => ({
          ...prev,
          player: hitRightEdge ? prev.player + 1 : prev.player,
          ai: hitLeftEdge ? prev.ai + 1 : prev.ai,
        }));

        setBall({
          x: 417,
          y: 240,
          speedX: 7,
          speedY: 7,
        });
        if (score.player === 5 || score.ai === 5) {
          setScore({ player: 0, ai: 0 });
          setGameStarted(false);
          return;
        }
        return;
      }
      // Ball collisions with top and bottom walls
      if (
        ball.y + 10 > canvasHeight - 10||
        ball.y + 10 < 0
      ) {
        setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
      }

      // Ball collisions with paddle
      const hitRightPaddle =
        ball.x >=
        canvasWidth - DIST_WALL_TO_PADDLE;
      const hitLeftPaddle =
        ball.x <= DIST_WALL_TO_PADDLE &&
        ball.y >= playerPaddleY &&
        ball.y <= playerPaddleY + PADDLE_HEIGHT;
      if (hitLeftPaddle || hitRightPaddle) {
        // Increase ball speed on paddle collision
        if (
          (hitLeftPaddle && ball.speedX < 0) ||
          (hitRightPaddle && ball.speedX >= 0)
        )
            setBall((prevBall) => ({ ...prevBall, speedX: -ball.speedX }));
      }
      // Ball movement
      setBall((prevBall) => ({
        ...prevBall,
        x:
          prevBall.x +
          (hitLeftPaddle || hitRightPaddle
            ? (hitLeftPaddle ? 1 : -1) * BALL_RADIUS
            : prevBall.speedX),
        y: prevBall.y + prevBall.speedY,
      }));
    };

    const gameInterval = setInterval(gameLoop, 17); 

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
    if (
      EnemyPaddleY + 40 < ball.y &&
      EnemyPaddleY + PADDLE_HEIGHT < canvasHeight
    ) {
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
    if (keys["ArrowDown"] && playerPaddleY + (PADDLE_HEIGHT + 5) < canvasHeight) {
      setPlayerPaddleY(playerPaddleY + PLAYER_PADDLE_SPEED);
    } else if (keys["ArrowUp"] && playerPaddleY > 5) {
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
