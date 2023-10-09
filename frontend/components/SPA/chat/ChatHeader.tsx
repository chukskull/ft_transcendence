import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";

interface chatHeaderProps {
  avatar: string;
  name: string;
  group: boolean;
  online: boolean;
}

const ChatHeader = (chatHeaderProps: chatHeaderProps) => {
  return (
    <div className={style["chat-header"]}>
      <div className={style["chat-user-group"]}>
        {!chatHeaderProps.group && (
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
        )}
        <div className={style["name"]}>{chatHeaderProps.name}</div>
        <Image
          src="/assets/components/ArrowDown.svg"
          alt="arrow"
          width={12}
          height={8}
          className={style["arrow-down"]}
        />
      </div>
      {chatHeaderProps.group && <FiLogOut className={style["leave-group"]} />}
    </div>
  );
};

export default ChatHeader;
