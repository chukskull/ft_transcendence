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
import { useRouter } from "next/navigation";
import { Console } from "console";


const UserMenu = (user: any, channel: boolean) => {
  const router = useRouter();
  const { id, nickName, avatarUrl, online } = user;
  console.log("inside user menu", user);
  return (
    <>
      <div className={style["user-info"]}>
        <AvatarBubble avatar={avatarUrl} online={online} />
        <h2>{nickName}</h2>
      </div>
      <div className={style["menu"]}>
        <div
          className={style["menu-item"]}
          onClick={() => {
            router.push(`/profile/${nickName}`);
          }}
        >
          <FaUser />
          View Profile
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/invite/${id}`
            );
          }}
        >
          <BsController />
          Invite To A Game
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post(
              `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/${nickName}`
            );
          }}
        >
          <BsChatLeftText />
          Message
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/addfriend/${id}`
            );
          }}
        >
          <FaUserPlus />
          Add Friend
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/1`
            );
          }}
        >
          <FaUserSlash />
          Block
        </div>
        {!channel && (
          <>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/mod/${id}/1`
                );
              }}
            >
              <FaUserShield />
              Make A Moderator
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/mute/${id}/1`
                );
              }}
            >
              <FaVolumeMute />
              Mute
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/ban/${id}/1`
                );
              }}
            >
              <FaBan />
              Ban From Channel
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserMenu;
