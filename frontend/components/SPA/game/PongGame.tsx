import React, { useEffect, useRef } from "react";

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 860; // Set your canvas width
  const gameData = useRef({
    x: 50,
    y: 100,
    dx: 1,
    dy: 1,
    playerPaddleY: 150,
    aiPaddleY: 150,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const gameLoop = () => {
      const { x, y, dx, dy, playerPaddleY, aiPaddleY } = gameData.current;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Update position
      gameData.current.x = x + dx;
      gameData.current.y = y + dy;

      // Check for ball going out of X walls
      if (x + dx > canvasWidth || x + dx < 0) {
        // Reset ball position and direction
        gameData.current.x = canvasWidth / 2;
        gameData.current.y = canvas.height / 2;
        gameData.current.dx = 2;
        gameData.current.dy = 2;
      }

      // Ball collisions with top and bottom walls
      if (y + dy > canvas.height - 15 || y + dy < 15) {
        gameData.current.dy = -dy;
      }

      // Ball collisions with paddles
      if (
        x + dx > canvas.width - 10 ||
        (x + dx < 10 && y > playerPaddleY && y < playerPaddleY + 80)
      ) {
        gameData.current.dx = -dx;
      }

      // Update AI paddle position based on ball's y-coordinate
      if (aiPaddleY + 40 < y) {
        gameData.current.aiPaddleY = aiPaddleY + 2;
      } else if (aiPaddleY > y) {
        gameData.current.aiPaddleY = aiPaddleY - 2;
      }

      // Draw the paddles
      context.fillRect(10, playerPaddleY, 10, 80); // Player's paddle
      context.fillRect(canvas.width - 20, aiPaddleY, 10, 80); // AI's paddle

      // Draw the ball
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fillStyle = "#fff";
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

  return <canvas ref={canvasRef} width={canvasWidth} height={504}></canvas>;
};

export default PingPongGame;
