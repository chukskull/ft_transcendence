import React, { useState } from "react";
import NavBar from "../Components/Navbar";
import style from "../styles/Home.module.scss";
import MatchHistory from "../Components/MatchHistory";
import ProfileStats from "../Components/ProfileStats";
import Leaderboard from "../Components/LeaderBoard";

const avatarUrl = "https://i.pravatar.cc/300";

const players = [
  {
    id: 1,
    username: "JohnDoe",
    score: 100,
    avatar: avatarUrl,
  },
  {
    id: 2,
    username: "JaneSmith",
    score: 90,
    avatar: avatarUrl,
  },
  {
    id: 2,
    username: "JaneSmith",
    score: 90,
    avatar: avatarUrl,
  },
  {
    id: 2,
    username: "JaneSmith",
    score: 90,
    avatar: avatarUrl,
  },
];

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <NavBar userName="John Doe" avatarUrl="https://i.pravatar.cc/300" />
      <div className={style.homepage}>
        <div className={style.welcome}>
          <div className={style.left}>
            <img src={avatarUrl} alt="User Profile" />
            <h1>Welcome, John Doe!</h1>
          </div>
          <button className={style.btn}>Play</button>
        </div>
        <div className={style.main}>
          <div className={style.left}>
            <MatchHistory />
          </div>
          <div className={style.center}>
            <ProfileStats />
          </div>
          <div className={style.right}>
            <Leaderboard players={players} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
