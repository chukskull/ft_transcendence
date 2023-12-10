import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import io from "socket.io-client";
import { set } from "lodash";

type Score = {
  player1: number;
  player2: number;
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

  const keys = useKeyHandler();
  useEffect(() => {
    if (!socket) return;
    if (keys["ArrowUp"] && player1PaddleY > 0) {
      setPlayer1PaddleY(player1PaddleY - 5);
    }
    if (keys["ArrowDown"] && player1PaddleY + 110 < 500) {
      setPlayer1PaddleY(player1PaddleY + 5);
    }
    socket.emit("positionUpdate", {
      player1PaddleY,
    });
  }, [keys]);

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

  return (
    <div className={style.gameBody} tabIndex={0}>
      <p>{score.player1}</p>
      <div className={style[`${map}`]} tabIndex={0}>
        <div className={style.middleLine} />
        <div className={style.player} style={{ top: player1PaddleY }}></div>
        <div className={style.ai} style={{ top: EnemyPaddleY }}></div>
        <div
          className={style.ball}
          style={{
            top: ball.y,
            left: ball.x,
          }}
        ></div>
      </div>
      <p>{score.player2}</p>
    </div>
  );
}
