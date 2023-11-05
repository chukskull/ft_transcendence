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

const UserMenu = () => {
  return (
    <>
      <div className={style["user-info"]}>
        <AvatarBubble avatar="/assets/components/Profile.svg" online />
        <h2>John Doe</h2>
      </div>
      <div className={style["menu"]}>
        <div className={style["menu-item"]}>
          <FaUser />
          View Profile
        </div>
        <div className={style["menu-item"]}>
          <BsController />
          Invite To A Game
        </div>
        <div className={style["menu-item"]}>
          <BsChatLeftText />
          Message
        </div>
        <div className={style["menu-item"]}>
          <FaUserPlus />
          Add Friend
        </div>
        <div className={style["menu-item"]}>
          <FaUserSlash />
          Block
        </div>
        <div className={style["menu-item"]}>
          <FaUserShield />
          Make A Moderator
        </div>
        <div className={style["menu-item"]}>
          <FaVolumeMute />
          Mute
        </div>
        <div className={style["menu-item"]}>
          <FaBan />
          Ban From Channel
        </div>
      </div>
    </>
  );
};

export default UserMenu;
