import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";

type Score = {
  player: number;
  ai: number;
};

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

export default function TheGame({
  map,
  onlinemode,
}: {
  map: string;
  onlinemode: boolean;
}) {
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
      // Update paddle position
      if (keys["ArrowUp"] && playerPaddleY > 0) {
        setPlayerPaddleY(playerPaddleY - 5);
      }
      if (keys["ArrowDown"] && playerPaddleY + 110 < canvasHeight) {
        setPlayerPaddleY(playerPaddleY + 5);
      }

      // Ball movement
      setBall((prevBall) => ({
        ...prevBall,
        x: prevBall.x + prevBall.speedX,
        y: prevBall.y + prevBall.speedY,
      }));

      // Check for ball going out of horizontal walls
      if (ball.x + ball.speedX > canvasWidth || ball.x + ball.speedX < 15) {
        if (ball.x + ball.speedX > canvasWidth) {
          setScore((prev) => ({ ...prev, player: prev.player + 1 }));
        } else if (ball.x + ball.speedX < 15) {
          setScore((prev) => ({ ...prev, ai: prev.ai + 1 }));
        }
        setBall({
          x: 417,
          y: 240,
          speedX: 2,
          speedY: 2,
        });
        return;
      }

      // Ball collisions with top and bottom walls
      if (
        ball.y + ball.speedY > canvasHeight - 15 ||
        ball.y + ball.speedY < -3
      ) {
        setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
      }

      // Ball collisions with paddles
      if (
        ball.x + ball.speedX > canvasWidth - 53 ||
        (ball.x + ball.speedX < 25 &&
          ball.y >= playerPaddleY &&
          ball.y <= playerPaddleY + 110)
      ) {
        // Increase ball speed on paddle collision
        const increasedSpeedX = -ball.speedX * 1.05; // Increase speed by a factor (e.g., 1.2)
        setBall((prevBall) => ({ ...prevBall, speedX: increasedSpeedX }));
      }

      // Update AI paddle position based on ball's y-coordinate
      if (!onlinemode) {
        if (EnemyPaddleY + 40 < ball.y && EnemyPaddleY + 110 < canvasHeight) {
          setEnemyPaddleY(EnemyPaddleY + 2);
        } else if (EnemyPaddleY + 40 > ball.y && EnemyPaddleY > 5) {
          setEnemyPaddleY(EnemyPaddleY - 2);
        }
      }
    };

    const gameInterval = setInterval(gameLoop, 10);

    return () => {
      clearInterval(gameInterval);
    };
  }, [ball, playerPaddleY, EnemyPaddleY, keys, gameStarted, onlinemode]);

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
