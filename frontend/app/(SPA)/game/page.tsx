"use client";
import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import { GiSwordsEmblem } from "react-icons/gi";
import PingPongGame from "@/components/SPA/game/PongGame";
const Game = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  return (
    <div className={style.gamePage}>
      <div className={style.gameHeader}>
        <h1>GAME BETWEEN</h1>
        <div className={style.players}>
          <div className={style.player}>
            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=2" alt="Player 1" />
            </div>
            <h3>le_Mountassir</h3>
          </div>
          <GiSwordsEmblem className={style.vs} />
          <div className={style.player}>
            <h3>le_mon</h3>

            <div className={style.hexAvatar}>
              <img src="https://i.pravatar.cc/300?img=21" alt="Player 2" />
            </div>
          </div>
        </div>
      </div>
      <div className={style.gameBody}>
        <p>{playerScore}</p>
        <div className={style.game}>
          <PingPongGame />
        </div>

        <p>{aiScore}</p>
      </div>
    </div>
  );
};

export default Game;
