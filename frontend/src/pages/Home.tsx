import React, { useState } from "react";
import NavBar from "../Components/Navbar";
import style from "../styles/Home.module.scss";
import MatchHistory from "../Components/MatchHistory";
import ProfileStats from "../Components/ProfileStats";
import Leaderboard from "../Components/LeaderBoard";
import ChatMenu from "../Components/ChatMenu";


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
      <NavBar userName="John Doe" avatarUrl={avatarUrl} />
      <div className={style.main}>
        <div className={style.chatMenu}>
          <ChatMenu />
        </div>
      </div>
    </>
  );
};

export default Home;
