import AvatarBubble from "./AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";

const MsgsList = (msgs: any) => {
  return (
    <div className={style["msgs-list"]}>
      {msgs.msgs.map((msg: any) => (
        <div className={style["msg-item"]} key={msg.name}>
          <AvatarBubble avatar={msg.avatar} online={msg.online} />
          <div className={style["msg-info"]}>
            <div className={style["username"]}>{msg.name}</div>
            <div className={style["msg-content"]}>{msg.lastMsg}</div>
          </div>
          <div className={style["msg-time"]}>{msg.lastMsgTime}</div>
        </div>
      ))}
    </div>
  );
};

export default MsgsList;