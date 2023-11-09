import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { useState } from "react";
import { Badge } from "@nextui-org/react";

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
  className?: string;
}

const DMbox = ({ dm, SendConversationId, className }: DMSectionProps) => {
  const sendConversationId = () => {
    SendConversationId(dm.name);
  };
  return (
    <div
      className={`${style["dm-item"]} ${className} `}
      key={dm.name}
      onClick={sendConversationId}
    >
      {" "}
      <AvatarBubble badge={5} avatar={dm.avatar} online={dm.online} />
      <div className={style["dm-info"]}>
        <div className={style["dm-name"]}>{dm.name}</div>
        <div className={style["dm-last-msg"]}>{dm.lastMsg}</div>
      </div>
      <div className={style["dm-time"]}>{dm.lastMsgTime}</div>
    </div>
  );
};

export default DMbox;
