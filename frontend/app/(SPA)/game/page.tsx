"use client";
import React, { useRef, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import { GiSwordsEmblem } from "react-icons/gi";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 860; // Set your canvas width
  const [score, setScore] = React.useState({ player: 0, ai: 0 });
  const gameData = useRef({
    ballX: 430,
    ballY: 250,
    ballSpeedX: 2,
    ballSpeedY: 2,
    playerPaddleY: 210,
    aiPaddleY: 210,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const gameLoop = () => {
      const {
        ballX,
        ballY,
        ballSpeedX,
        ballSpeedY,
        playerPaddleY,
        aiPaddleY,
      } = gameData.current;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // ball movement
      gameData.current.ballX = ballX + ballSpeedX;
      gameData.current.ballY = ballY + ballSpeedY;

      // Check for ball going out of horizontal walls
      if (ballX + ballSpeedX > canvasWidth || ballX + ballSpeedX < 0) {
        // Reset ball position and direction
        gameData.current.ballX = canvasWidth / 2;
        gameData.current.ballY = canvas.height / 2;
        // increase score for the player who scored
        if (ballX + ballSpeedX > canvasWidth) {
          setScore((prev) => ({ ...prev, player: prev.player + 1 }));
        } else {
          setScore((prev) => ({ ...prev, ai: prev.ai + 1 }));
        }
        // encrease ball speed
        gameData.current.ballSpeedX *= 1.02;
        gameData.current.ballSpeedY *= 1.02;
      }

      // Ball collisions with top and bottom walls
      if (ballY + ballSpeedY > canvas.height - 10 || ballY + ballSpeedY < 10) {
        gameData.current.ballSpeedY = -ballSpeedY;
      }

      // Ball collisions with paddles
      if (
        ballX + ballSpeedX > canvas.width - 20 ||
        (ballX + ballSpeedX < 20 &&
          ballY > playerPaddleY &&
          ballY < playerPaddleY + 110)
      ) {
        gameData.current.ballSpeedX = -ballSpeedX;
      }

      // Update AI paddle position based on ball's y-coordinate
      if (aiPaddleY + 40 < ballY && aiPaddleY + 80 < canvas.height) {
        gameData.current.aiPaddleY = aiPaddleY + 2;
      } else if (aiPaddleY + 40 > ballY && aiPaddleY > 5) {
        gameData.current.aiPaddleY = aiPaddleY - 2;
      }

      context.fillStyle = "red"; // Background color
      context.fillRect(10, playerPaddleY, 12.75, 110); // Player's paddle
      context.fillStyle = "pink";
      context.fillRect(canvas.width - 20, aiPaddleY, 12.75, 110); // AI's paddle

      // Draw the ball
      context.beginPath();
      context.arc(ballX, ballY, 8, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      context.closePath();

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" && gameData.current.playerPaddleY > 0) {
      gameData.current.playerPaddleY -= 10;
    } else if (
      e.key === "ArrowDown" &&
      gameData.current.playerPaddleY + 80 < canvasRef.current!.height
    ) {
      gameData.current.playerPaddleY += 15;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          <canvas ref={canvasRef} width={canvasWidth} height={504}></canvas>
        </div>
        <p>{score.ai}</p>
      </div>
    </div>
  );
};

export default Game;
