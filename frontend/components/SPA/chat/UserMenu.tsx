import style from "@/styles/SPA/chat/chat.module.scss";
import {
  FaUser,
  FaUserPlus,
  FaUserSlash,
  FaUserShield,
  FaVolumeMute,
  FaBan,
} from "react-icons/fa";
import { BsController, BsChatLeftText } from "react-icons/bs";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import axios from "axios";

const UserMenu = (user:any) => {
  return (
    <>
      <div className={style["user-info"]}>
        <AvatarBubble avatar="/assets/components/Profile.svg" online />
        <h2>John Doe</h2>
      </div>
      <div className={style["menu"]}>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaUser />
          View Profile
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <BsController />
          Invite To A Game
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <BsChatLeftText />
          Message
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaUserPlus />
          Add Friend
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaUserSlash />
          Block
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaUserShield />
          Make A Moderator
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaVolumeMute />
          Mute
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post("/api/auth/logout");
          }}
        >
          <FaBan />
          Ban From Channel
        </div>
      </div>
    </>
  );
};

export default UserMenu;
