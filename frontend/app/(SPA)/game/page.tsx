"use client";
import React, { useState, useEffect, use } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import GHeader from "@/components/SPA/game/Gmheader";
import TheGame from "@/components/SPA/game/TheGame";
import Result from "@/components/SPA/game/Result";
import io from "socket.io-client";
import { Button } from "@nextui-org/react";
import OnlineGame from "@/components/SPA/game/OnlineGame";

const Game: React.FC = () => {
  const [map, setMap] = useState<string>("game");
  const [gameStarted, setGameStarted] = useState(false);
  const [onlineMode, setOnlineMode] = useState<boolean>(false);
  const [score, setScore] = useState<Record<string, number>>({
    player: 0,
    enemy: 0,
  });
  const [ball, setBall] = useState({
    x: 430,
    y: 250,
    speedX: 2,
    speedY: 2,
  });
  const [playerPaddleY, setPlayerPaddleY] = useState<number>(210);
  const [online, setOnline] = useState<boolean>(false);
  const [showRec, setRec] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [socket, setSocket] = useState<any>(null);
  const [joinedQueue, setJoinedQueue] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gameSockets`);
    newSocket.connect();
    setSocket(newSocket);
    return () => {
      socket?.disconnect();
    };
  }, []);

  function handleJoinQueue() {
    if (socket) {
      socket?.emit("joinQueue", { token: document.cookie.split("=")[1] });
    }
  }
  socket?.on("changeState", (data: any) => {
    if (data.status == "inQueue") {
      setJoinedQueue(true);
    } else if (data.status == "failed") {
      // popus that user is already in queue in another window
    }
  });
  socket?.on("gameStarted", (data: any) => {
    setJoinedQueue(false);
    setOnlineMode(true);
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 500);
    if (value === 100) {
      setRec(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [value]);

  const renderRectangle = () => {
    if (showRec) {
      return (
        <div className={style.centeredContent}>
          <div
            style={{
              opacity: 0.6,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              zIndex: 1,
            }}
          ></div>
          <div className="" style={{ position: "relative", zIndex: 2 }}>
            <Result
              name={"hamze kornabi"}
              img={"https://i.pravatar.cc/300?img=1"}
              scoreleft={0}
              scoreright={3}
              result="You Lost"
              value={value}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={style.gamePage}>
      <GHeader />
      <>
        <div className={style.mapSelector}>
          <div className={style.map} onClick={() => setMap("game")}>
            <p>2077</p>
            <img src="https://img.asmedia.epimg.net/resizer/ZoSGJHZZZxMPC694PogLeAI0u8E=/644x362/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/G2RDQ2OAUBAHBOFENCS5F23WFA.png" />
          </div>
          <div className={style.map} onClick={() => setMap("retro")}>
            <p>Retro</p>
            <img src="https://i0.wp.com/mynintendonews.com/wp-content/uploads/2011/08/nes-controller.jpg" />
          </div>
          <div className={style.map} onClick={() => setMap("gym")}>
            <p>Grizzly</p>
            <img src="https://w7.pngwing.com/pngs/276/422/png-transparent-football-field-football-field-green-background-football.png" />
          </div>
        </div>
      </>
      <div className="flex flex-col gap-9 justify-center items-center">
        {onlineMode ? (
          <OnlineGame map={map} socket={socket} />
        ) : (
          <TheGame map={map} />
        )}
        <div>
          <Button
            className="bg-live text-white font-semibold text-base max-w-[239px] transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-80"
            data-hover
            data-focus
            onClick={() => {
              handleJoinQueue();
            }}
          >
            JOIN MATCHMAKING
          </Button>
        </div>
      </div>
      {renderRectangle()}
    </div>
  );
};

export default Game;
