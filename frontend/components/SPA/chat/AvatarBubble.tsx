"use client";
import { Avatar } from "@nextui-org/react";
import { color, motion } from "framer-motion";

import { Badge } from "@nextui-org/badge";
interface AvatarBubbleProps {
  avatar: any;
  online: any;
  badge?: any;
}
const AvatarBubble = ({ avatar, online, badge }: AvatarBubbleProps) => {
  return (
    <>
      <Badge isInvisible={badge ? false : true} content={badge} shape="circle">
        <Avatar
          src={avatar}
          alt="avatar"
          isBordered
          color={online ? "success" : "danger"}
          className="h-9 w-9 ml-1 cursor-pointer"
          size="lg"
          // className={style["avatar"]}
        ></Avatar>
      </Badge>
      {/* {online && <div className={style["online"]}></div>} */}
    </>
  );
};
export default AvatarBubble;
