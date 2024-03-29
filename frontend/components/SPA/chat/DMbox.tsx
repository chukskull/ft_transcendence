import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";

interface DMSectionProps {
  dm: any;
  className?: string;
  badge?: any;
}

const DMbox = ({ dm, className, badge }: DMSectionProps) => {
  return (
    <div className={`${style["dm-item"]} ${className} `} key={dm.id}>
      <AvatarBubble
        badge={badge}
        avatar={dm.members[0].avatarUrl}
        online={dm.members[0].status === "online" ? true : false}
        key={dm?.id}
      />
      <div className={style["dm-info"]}>
        <div className={style["dm-name"]}>{dm.members[0].nickName}</div>
        <div className={style["dm-last-msg"]}>{`#${dm.members[0].status}`}</div>
      </div>
      <div className={style["dm-time"]}>{dm.lastMsgTime}</div>
    </div>
  );
};

export default DMbox;
