import { useEffect, useRef } from "react";
import AvatarBubble from "./AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";

const MsgsList = ({ chats }: { chats: any }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[chats]);
  return (
    
    <div className={style["msgs-list"]}>
      {chats?.map((msg: any) => (
        <div className={style["msg-item"]} key={msg?.id}>
          <AvatarBubble
            avatar={msg.sender?.avatarUrl}
            online={msg.sender?.status}
          />
          <div className={style["msg-info"]}>
            <div className={style["username"]}>{msg.sender?.nickName}</div>
            <div className={style["msg-content"]}>{msg?.message}</div>
          </div>
          <div className={style["msg-time"]}>{msg?.time}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MsgsList;
