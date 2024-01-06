"use client";
import { Avatar, Button } from "@nextui-org/react";
import React from "react";

interface LiveGameRecProps {
  LeftProf: string;
  RightProf: string;
  nickLeft: string;
  nickRight: string;
  scoreLeft: number;
  scoreRight: number;
  onlineleft?: string;
  onlineright?: string;
}

export const LiveGameRec = ({
  LeftProf,
  RightProf,
  nickLeft,
  nickRight,
  scoreLeft,
  scoreRight,
  onlineleft,
  onlineright,
}: LiveGameRecProps) => {
  return (
    <div className="flex items-center  justify-between px-8 border-1 border-none rounded-2xl w-full bg-purpleProfile h-20">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 md:w-[135px]">
        <Avatar
          isBordered
          color={onlineleft === "online" ? "success" : "danger"}
          src={LeftProf}
          size="sm"
          className="md:h-10 md:w-10"
        />
        <h1 className="text-fontlight text-sm md:text-lg font-ClashGrotesk-Medium">
          {nickLeft}
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center  py-1">
        <h1 className="text-fontlight ">
          {scoreLeft} - {scoreRight}
        </h1>
        <h1 className="text-fontlight font-extrabold text-lg"> VS </h1>
      </div>
      <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-end gap-2 md:gap-4 md:w-[135px]">
        <h1 className="text-fontlight text-sm md:text-lg font-ClashGrotesk-Medium">
          {nickRight}
        </h1>
        <Avatar
          isBordered
          color={onlineright === "online" ? "success" : "danger"}
          src={RightProf}
          size="sm"
          className="md:h-10 md:w-10"
        />
      </div>
    </div>
  );
};
export default LiveGameRec;
