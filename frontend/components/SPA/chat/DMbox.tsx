import Image from "next/image";
import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";


interface DMboxProps {
  name: string;
  online: boolean;
  lastMsg: string;
  lastMsgTime: string;
  avatar: string;
}

const DMbox = ({ dm }: { dm: DMboxProps }) => {
  return (
    <div className={style["dm-item"]} key={dm.name}>
      <AvatarBubble avatar={dm.avatar} online={dm.online} />
      <div className={style["dm-info"]}>
        <div className={style["dm-name"]}>{dm.name}</div>
        <div className={style["dm-last-msg"]}>{dm.lastMsg}</div>
      </div>
      <div className={style["dm-time"]}>{dm.lastMsgTime}</div>
    </div>
  );
};

export default DMbox;
