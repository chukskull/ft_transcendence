import AvatarBubble from "./AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";

const MsgsList = (msgs: any) => {
  const lastMsg = msgs?.msgs[msgs.msgs.length - 1];
  return (
    <div className={style["msgs-list"]}>
      {msgs.msgs.map((msg: any) => (
        <div className={style["msg-item"]} key={msg?.id}>
          <AvatarBubble avatar={msg.avatar} online={msg.sender?.status} />
          <div className={style["msg-info"]}>
            <div className={style["username"]}>{msg.sender?.nickName}</div>
            <div className={style["msg-content"]}>{msg?.lastMsg}</div>
          </div>
          <div className={style["msg-time"]}>{lastMsg?.message}</div>
        </div>
      ))}
    </div>
  );
};

export default MsgsList;
