import style from "@/styles/SPA/game/game.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { GiSwordsEmblem } from "react-icons/gi";
export default function GHeader({ isONline, enemy }: any) {
  const [myProfile, setMyProfile] = useState<any>({});

  useEffect(() => {
    console.log("refetching data");
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setMyProfile(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className={style.gameHeader}>
      <div className={style.players}>
        <div className={style.player}>
          <div className={style.hexAvatar}>
            <img src={myProfile.avatarUrl} alt="me" />
          </div>
          <h3>{myProfile.nickName}</h3>
        </div>
        <GiSwordsEmblem className={style.vs} />
        <div className={style.player}>
          <h3>{isONline ? enemy.nickName : "Computer"}</h3>
          <div className={style.hexAvatar}>
            <img
              src={
                isONline
                  ? enemy.avatarUrl
                  : "https://disruptive.asia/wp-content/uploads/2023/01/bigstock-Monkey-and-computer-95529134.jpg"
              }
              alt="enemy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
