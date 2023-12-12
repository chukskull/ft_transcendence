import React, { useState, useEffect, useCallback, memo } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import io from "socket.io-client";
import { set } from "lodash";

type Score = {
  player1: number;
  player2: number;
};

export default function OnlineGame({
  map,
  socket,
}: {
  map: string;
  socket: any;
}) {
  const [score, setScore] = useState<Score>({ player1: 0, player2: 0 });
  const [ball, setBall] = useState({ x: 430, y: 250, speedX: 2, speedY: 2 });
  const [player1PaddleY, setPlayer1PaddleY] = useState<number>(210);
  const [EnemyPaddleY, setEnemyPaddleY] = useState<number>(210);

  const handleKeyboardEvent = useCallback((e: KeyboardEvent) => {
    if (!socket) return;
    let newPaddlePosition = player1PaddleY;
    if (e.key === "ArrowDown") {
      newPaddlePosition = player1PaddleY + 5;
    } else if (e.key === "ArrowUp") {
      newPaddlePosition = player1PaddleY - 5;
    }
    if (newPaddlePosition + 110 >= 500 || newPaddlePosition <= 0) return;
    setPlayer1PaddleY(newPaddlePosition);
    socket.emit("positionUpdate", {
      player1PaddleY: newPaddlePosition,
    });
  }, [player1PaddleY]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  socket.on("roomPostions", (data: any) => {
    setEnemyPaddleY(data.enemyY);
    setBall({
      x: data.ballX,
      y: data.ballY,
      speedX: 2,
      speedY: 2,
    });
  });

  socket.on("changeState", (data: any) => {
    console.log("this is event on joinmatchmaking ", data);
  });

  socket.on("updateScore", (data: any) => {
    setScore(data);
  });

  return (
    <div className={style.gameBody} tabIndex={0}>
      <p>{score.player1}</p>
      <div className={style[`${map}`]} tabIndex={0}>
        <PlayerPaddle player1PaddleY={player1PaddleY} />
        <EnemyPaddle EnemyPaddleY={EnemyPaddleY} />
        <div
          className={style.ball}
          style={{
            top: ball.y,
            left: ball.x,
          }}
        ></div>
      </div>
      <p>{score.player2}</p>
    </div >
  );
}

const PlayerPaddle = memo(({ player1PaddleY, EnemyPaddleY }: any) => {
  return (
    <div className={style.player} style={{ top: player1PaddleY }}></div>
  );
});

const EnemyPaddle = memo(({ EnemyPaddleY }: any) => {
  return (
    <div className={style.ai} style={{ top: EnemyPaddleY }}></div>
  );
});
