import style from "@/styles/SPA/game/game.module.scss";

import { GiSwordsEmblem } from "react-icons/gi";

export default function GHeader() {
  return (
    <div className={style.gameHeader}>

      <div className={style.players}>
        <div className={style.player}>
          <div className={style.hexAvatar}>
            <img src="https://i.pravatar.cc/300?img=2" alt="Player 1" />
          </div>
          <h3>Player 1 Name</h3>
        </div>
        <GiSwordsEmblem className={style.vs} />
        <div className={style.player}>
          <h3>AI</h3>
          <div className={style.hexAvatar}>
            <img src="https://i.pravatar.cc/300?img=21" alt="Player 2" />
          </div>
        </div>
      </div>
    </div>
  );
}
