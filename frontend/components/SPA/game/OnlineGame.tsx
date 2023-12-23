import React, { useState, useEffect, useCallback, memo, use } from "react";
import style from "@/styles/SPA/game/game.module.scss";

type Score = {
  player1: number;
  player2: number;
};

type RoomPositionsData = {
  ballX: number;
  ballY: number;
}

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
  const [winner, setWinner] = useState<number>(0);

  const handleKeyboardEvent = useCallback(
    (e: KeyboardEvent) => {
      if (!socket) return;
      let newPaddlePosition = player1PaddleY;
      if (e.key === "ArrowDown") {
        newPaddlePosition = player1PaddleY + 8;
      } else if (e.key === "ArrowUp") {
        newPaddlePosition = player1PaddleY - 8;
      }
      if (newPaddlePosition + 110 >= 500 || newPaddlePosition <= 0) return;
      setPlayer1PaddleY(newPaddlePosition);
      socket.emit("positionUpdate", {
        player1PaddleY: newPaddlePosition,
      });
    },
    [player1PaddleY]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  useEffect(() => {
    socket.on("enemyPositionUpdate", (data: any) => {
      setEnemyPaddleY(data.enemyY);
    });

    socket.on("changeState", (data: any) => {
      console.log("this is event on joinmatchmaking ", data);
    });

    socket.on("updateScore", (data: any) => {
      setScore(data);
    });
    socket.on("gameEnded", (data: any) => {
      console.log("game ended", data);
      setWinner(data.winner);
    });

    return () => {
      socket.off("enemyPositionUpdate");
      socket.off("changeState");
      socket.off("updateScore");
      socket.off("gameEnded");
    };
  }, []);


  return (
    <>
      <div className={style.gameBody} tabIndex={0}>
        <p>{score.player1}</p>
        <div className={style[`${map}`]} tabIndex={0}>
          <PlayerPaddle player1PaddleY={player1PaddleY} />
          <EnemyPaddle EnemyPaddleY={EnemyPaddleY} />
          <Ball socket={socket} />
        </div>
        <p>{score.player2}</p>
      </div >
    </>
  );
}

const PlayerPaddle = memo(({ player1PaddleY }: any) => {
  return (
    <div className={style.player} style={{ top: player1PaddleY }}></div>
  );
});

const EnemyPaddle = memo(({ EnemyPaddleY }: any) => {
  return <div className={style.ai} style={{ top: EnemyPaddleY }}></div>;
});

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
    <div className={style.ball} style={{ top: position.y, left: position.x }}></div>
  );
};