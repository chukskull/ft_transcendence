import React, { useState, useEffect, useCallback } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import Rectangle from "./Rectangle";

export const PADDLESPEED = 20;

type Score = {
  player1: number;
  player2: number;
};

type RoomPositionsData = {
  ballX: number;
  ballY: number;
};

export default function OnlineGame({
  map,
  socket,
}: {
  map: string;
  socket: any;
}) {
  const [score, setScore] = useState<Score>({ player1: 0, player2: 0 });
  const [player1PaddleY, setPlayer1PaddleY] = useState<number>(210);
  const [EnemyPaddleY, setEnemyPaddleY] = useState<number>(210);

  const [infoGame, setInfoGame] = useState<any>({
    winner: "",
    loser: "",
    player1Score: 0,
    player2Score: 0,
  });

  const [showRec, setshowRec] = useState<boolean>(false);

  const handleKeyboardEvent = useCallback(
    (e: KeyboardEvent) => {
      if (!socket) return;
      if (e.key == "ArrowDown" && player1PaddleY + 100 + PADDLESPEED <= 500)
        setPlayer1PaddleY((prev) => prev + PADDLESPEED);
      else if (e.key == "ArrowUp" && player1PaddleY - PADDLESPEED >= 0)
        setPlayer1PaddleY((prev) => prev - PADDLESPEED);

      socket.emit("positionUpdate", {
        player1PaddleY: player1PaddleY,
      });
    },
    [player1PaddleY]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardEvent);
    socket.emit("positionUpdate", {
      player1PaddleY: player1PaddleY,
    });
    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  useEffect(() => {
    socket.on("enemyPositionUpdate", (data: any) => {
      setEnemyPaddleY(data.enemyY);
      setPlayer1PaddleY(data.myposition);
    });

    socket.on("changeState", (data: any) => {});

    socket.on("updateScore", (data: any) => {
      setScore(data);
    });

    socket.on("gameEnded", (data: any) => {
      setshowRec(true);
      setInfoGame(data);
    });

    return () => {
      socket.off("enemyPositionUpdate");
      socket.off("changeState");
      socket.off("updateScore");
      socket.off("gameEnded");
    };
  }, [socket]);

  return (
    <>
      <div className={style.gameBody} tabIndex={0}>
        <p>{score.player1}</p>
        <div className={style[`${map}`]} tabIndex={0}>
          <div className={style.player} style={{ top: player1PaddleY }}></div>
          <div className={style.ai} style={{ top: EnemyPaddleY }}></div>
          <Ball socket={socket} />
        </div>
        <p>{score.player2}</p>
      </div>
      <Rectangle
        display={showRec}
        leftScore={infoGame.player1Score}
        rightScore={infoGame.player2Score}
      />
    </>
  );
}
const Ball = ({ socket }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleRoomPositions = (data: RoomPositionsData) => {
      setPosition({ x: data.ballX, y: data.ballY });
    };

    socket.on("roomPostions", handleRoomPositions);

    return () => {
      socket.off("roomPostions", handleRoomPositions);
    };
  }, []);

  return (
    <div
      className={style.ball}
      style={{ top: position.y, left: position.x }}
    ></div>
  );
};
