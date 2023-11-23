import AvatarBubble from "./AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";

const MsgsList = ({ chats }: { chats: any[] }) => {
  // Check if chats is an array before calling map
  if (!Array.isArray(chats)) {
    console.error("chats is not an array");
    return null; // or handle the error in a way that makes sense for your application
  }

  return (
    <div className={style["msgs-list"]}>
      {chats.map((msg: any) => (
        <div className={style["msg-item"]} key={msg?.id}>
          <AvatarBubble avatar={msg.avatar} online={msg.sender?.status} />
          <div className={style["msg-info"]}>
            <div className={style["username"]}>{msg.sender?.nickName}</div>
            <div className={style["msg-content"]}>{msg?.message}</div>
          </div>
          <div className={style["msg-time"]}>{msg}</div>
        </div>
      ))}
    </div>
  );
};

export default MsgsList;
