"use client";
import React, { useState, useEffect } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import GHeader from "@/components/SPA/game/Gmheader";
import TheGame from "@/components/SPA/game/TheGame";

const Game: React.FC = () => {
  return (
    <div className={style.gamePage}>
      <GHeader />
      <div className={style.mapSelector}>
        <div className={style.map}>
          <p>2077</p>
          <img src="https://img.asmedia.epimg.net/resizer/ZoSGJHZZZxMPC694PogLeAI0u8E=/644x362/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/G2RDQ2OAUBAHBOFENCS5F23WFA.png" />
        </div>
        <div className={style.map}>
          <p>Retro</p>
          <img src="https://i0.wp.com/mynintendonews.com/wp-content/uploads/2011/08/nes-controller.jpg" />
        </div>
        <div className={style.map}>
          <p>Minecraft</p>
          <img src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/minecraft-with-rtx/minecraft-with-rtx-of-temples-and-totems-001-rtx-on-logos.jpg" />
        </div>
        <div className={style.map}>
          <p>Grizzly</p>
          <img src="https://greekreporter.com/wp-content/uploads/2023/01/kyriakos-grizzly-credit-kyriakos-kapakoulak-youtube.jpg.webp" />
        </div>
      </div>
      <TheGame />
    </div>
  );
};

export default Game;
