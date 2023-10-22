"use client";

import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import Image from "next/image";

const Game = () => {
  const [playerY, setPlayerY] = useState(50);
  const [aiY, setAiY] = useState(50);

  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);

  const [ballSpeedX, setBallSpeedX] = useState(1);
  const [ballSpeedY, setBallSpeedY] = useState(1);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  //   useEffect(() => {
  //     const updateGameArea = () => {
  //       setBallX(ballX + ballSpeedX);
  //       setBallY(ballY + ballSpeedY);

  //       // Ball collision with top and bottom walls
  //       if (ballY <= 0 || ballY >= 100) {
  //         setBallSpeedY(-ballSpeedY);
  //       }

  //       // Ball collision with player and AI paddles
  //       if (
  //         (ballX <= 5 && ballX >= 0 && ballY > playerY && ballY < playerY + 20) ||
  //         (ballX >= 95 && ballX <= 100 && ballY > aiY && ballY < aiY + 20)
  //       ) {
  //         console.log("hit");
  //         setBallSpeedX(-ballSpeedX);
  //       }

  //       const resetBall = () => {
  //         setBallX(50);
  //         setBallY(50);
  //         setBallSpeedX(1);
  //         setBallSpeedY(1);
  //       };

  //       // Ball out of bounds (point scored)
  //       if (ballX <= 0) {
  //         // AI scores a point
  //         setAiScore(aiScore + 1);
  //         resetBall();
  //       } else if (ballX >= 100) {
  //         // Player scores a point
  //         setPlayerScore(playerScore + 1);
  //         resetBall();
  //       }

  //       // Move AI paddle towards the ball
  //       if (aiY + 10 < ballY && ballX >= 50) {
  //         setAiY(aiY + 1);
  //       } else if (aiY + 10 > ballY && ballX >= 50) {
  //         setAiY(aiY - 1);
  //       }
  //     };

  //     const gameInterval = setInterval(updateGameArea, 10);

  //     return () => {
  //       clearInterval(gameInterval);
  //     };
  //   }, [playerY, aiY, ballX, ballY, ballSpeedX, ballSpeedY]);

  const movePlayerPaddle = (e: any) => {
    if (e.key === "ArrowUp" && playerY > 0) {
      setPlayerY(playerY - 1);
    } else if (e.key === "ArrowDown" && playerY < 80) {
      setPlayerY(playerY + 1);
    }
  };

  return (
    <div className={style.gamePage}>
      <div className={style.gameHeader}>
        <h1>GAME BETWEEN</h1>
        <div className={style.players}>
          <div className={style.player}>
            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=2" />
            </div>
            <h3>le_Mountassir</h3>
          </div>
          <div className={style.player}>
            <h3>le_Mountassir</h3>

            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=21" />
            </div>
          </div>
        </div>
      </div>
      <div className={style.gameBody}>
        <p>Player: {playerScore}</p>
        <div className={style.game} tabIndex={0} onKeyDown={movePlayerPaddle}>
          <div className={style.player} style={{ top: `${playerY}%` }}></div>
          <div className={style.ai} style={{ top: `${aiY}%` }}></div>
          <div
            className={style.ball}
            style={{ top: `${ballY}%`, left: `${ballX}%` }}
          ></div>
        </div>
        <p>AI: {aiScore}</p>
      </div>
    </div>
  );
};

export default Game;
