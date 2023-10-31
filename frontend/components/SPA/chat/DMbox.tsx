import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { useState } from "react";

interface DMboxProps {
  name: string;
  online: boolean;
  lastMsg: string;
  lastMsgTime: string;
  avatar: string;
}
interface DMSectionProps {
  dm: DMboxProps;
  SendConversationId: (id: string) => void;
}

const DMbox = ({ dm, SendConversationId }: DMSectionProps) => {
  const sendConversationId = () => {
    SendConversationId(dm.name);
  };
  return (
    <div
      className={style["dm-item"]}
      key={dm.name}
      onClick={sendConversationId}
    >
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
