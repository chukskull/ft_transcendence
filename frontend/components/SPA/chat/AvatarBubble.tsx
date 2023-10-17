"use client";
import Image from "next/image";
import style from "@/styles/SPA/chat/chat.module.scss";
import { Avatar } from "@nextui-org/react";
import { color, motion } from "framer-motion";
interface AvatarBubbleProps {
  avatar: string;
  online: boolean;
}
const AvatarBubble = ({ avatar, online }: AvatarBubbleProps) => {
  avatar = "https://i.pravatar.cc/300?img=1";
  return (
    <>
      <Avatar
        src={avatar}
        alt="avatar"
        isBordered
        color={online ? "success" : "danger"}
        className="h-9 w-9 ml-1 "
        // className={style["avatar"]}
      ></Avatar>
      {/* {online && <div className={style["online"]}></div>} */}
    </>
  );
};
export default AvatarBubble;
