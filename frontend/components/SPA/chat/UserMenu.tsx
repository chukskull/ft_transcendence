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

const UserMenu = ({ id, nickName, avatarUrl, channel, online }: any) => {
  const router = useRouter();
  console.log("UserMenu", id);

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
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/invite/${id}`
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <BsController />
          Invite To A Game
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            router.push(
              `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/users/${nickName}`
            );
          }}
        >
          <BsChatLeftText />
          Message
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sendFriendRequest/${id}`
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <FaUserPlus />
          Add Friend
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/1`
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <FaUserSlash />
          Block
        </div>
        {channel && (
          <>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${channel}/channels/modding/${id}/1`
                  )
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <FaUserShield />
              Make A Moderator
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channel}/muting/${id}/1`
                  )
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <FaVolumeMute />
              Mute
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channel}/banning/${id}/1`
                  )
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
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
