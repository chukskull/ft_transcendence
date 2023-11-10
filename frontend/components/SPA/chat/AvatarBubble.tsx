"use client";
import Image from "next/image";
import style from "@/styles/SPA/chat/chat.module.scss";
import { Avatar, Badge } from "@nextui-org/react";
import { color, motion } from "framer-motion";

interface AvatarBubbleProps {
  avatar: string;
  online: boolean;
  badge?: any;
}
const AvatarBubble = ({ avatar, online, badge }: AvatarBubbleProps) => {
  avatar = "https://i.pravatar.cc/300?img=1";
  return (
    <>
      <Badge isInvisible={badge ? false : true} content={badge} shape="circle">
        <Avatar
          src={avatar}
          alt="avatar"
          isBordered
          color={online ? "success" : "danger"}
          className="h-9 w-9 ml-1 "
          // className={style["avatar"]}
        ></Avatar>
      </Badge>
      {/* {online && <div className={style["online"]}></div>} */}
    </>
  );
};
export default AvatarBubble;
