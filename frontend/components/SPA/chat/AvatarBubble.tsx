import Image from "next/image";
import style from "@/styles/SPA/chat/chat.module.scss";

interface avatarBubbleProps {
  avatar: string;
  online: boolean;
}

const AvatarBubble = (avatarBubbleProps: avatarBubbleProps) => {
  return (
    <div className={style["avatar-bubble"]}>
      <Image
        src={avatarBubbleProps.avatar}
        alt="avatar"
        width={0}
        height={0}
        className={style["avatar"]}
      />
      {avatarBubbleProps.online && <div className={style["online"]}></div>}
    </div>
  );
};

export default AvatarBubble;
