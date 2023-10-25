"use client";
import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import { GiSwordsEmblem } from "react-icons/gi";

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

const Game: React.FC = () => {
  const canvasWidth: number = 860;
  const canvasHeight: number = 500;

  const [score, setScore] = useState<Score>({ player: 0, ai: 0 });
  const [ball, setBall] = useState({
    x: 430,
    y: 250,
    speedX: 2,
    speedY: 2,
  });
  const [playerPaddleY, setPlayerPaddleY] = useState(210);
  const [aiPaddleY, setAiPaddleY] = useState(210);

  const keys = useKeyHandler();

  useEffect(() => {
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
          x: canvasWidth / 2,
          y: canvasHeight / 2,
          speedX: 2,
          speedY: 2,
        });
      }

      // Ball collisions with top and bottom walls
      if (
        ball.y + ball.speedY > canvasHeight - 10 ||
        ball.y + ball.speedY < 1
      ) {
        setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
      }

      // Ball collisions with paddles
      if (
        ball.x + ball.speedX > canvasWidth - 42 ||
        (ball.x + ball.speedX < 25 &&
          ball.y > playerPaddleY &&
          ball.y < playerPaddleY + 100)
      ) {
        // Increase ball speed on paddle collision
        const increasedSpeedX = -ball.speedX * 1.07; // Increase speed by a factor (e.g., 1.2)
        setBall((prevBall) => ({ ...prevBall, speedX: increasedSpeedX }));
      }

      // Update AI paddle position based on ball's y-coordinate
      if (aiPaddleY + 40 < ball.y && aiPaddleY + 100 < canvasHeight - 10) {
        setAiPaddleY(aiPaddleY + 2);
      } else if (aiPaddleY + 40 > ball.y && aiPaddleY > 5) {
        setAiPaddleY(aiPaddleY - 2);
      }
    };

    const gameInterval = setInterval(gameLoop, 10);

    return () => {
      clearInterval(gameInterval);
    };
  }, [ball, playerPaddleY, aiPaddleY, keys]);

  return (
    <div className={style.gamePage}>
      <div className={style.gameHeader}>
        <h1>GAME BETWEEN</h1>
        <div className={style.players}>
          <div className={style.player}>
            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=2" alt="Player 1" />
            </div>
            <h3>Player 1 Name</h3>
          </div>
          <GiSwordsEmblem className={style.vs} />
          <div className={style.player}>
            <h3>Player 2 Name</h3>
            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=21" alt="Player 2" />
            </div>
          </div>
        </div>
      </div>

      <div className={style.gameBody}>
        <p>{score.player}</p>
        <div className={style.game} tabIndex={0} style={{ cursor: "none" }}>
          <div className={style.player} style={{ top: playerPaddleY }}></div>
          <div className={style.ai} style={{ top: aiPaddleY }}></div>
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
    </div>
  );
};

export default Game;
