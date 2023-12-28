"use client";
import { Avatar, Button } from "@nextui-org/react";
import React from "react";

interface LiveGameRecProps {
  LeftProf: string;
  RightProf: string;
  scoreLeft: number;
  scoreRight: number;
  boolBut?: boolean;
  onlineleft?: string;
  onlineright?: string;
}

export const LiveGameRec = ({
  LeftProf,
  RightProf,
  scoreLeft,
  scoreRight,
  onlineleft,
  onlineright,
  boolBut,
}: LiveGameRecProps) => {
  return (
    <>
      {boolBut ? (
        <div className="flex items-center justify-around flex-grow px-8 border-1 border-white rounded-xl w-full">
          <Avatar isBordered color="success" src={LeftProf} />
          <div className="flex flex-col items-center justify-center  py-1">
            <h1 className="text-fontlight ">
              {scoreLeft} - {scoreRight}
            </h1>
            <h1 className="text-fontlight font-extrabold text-lg"> VS </h1>
            <Button
              className="text-fontlight font-semibold text-center text-base bg-live rounded w-auto h-auto transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-80"
              radius="md"
            >
              Watch
            </Button>
          </div>
          <Avatar isBordered color="success" src={RightProf} />
        </div>
      ) : (
        <div className="flex items-center justify-around flex-grow px-8 border-1 border-none rounded-2xl w-full bg-purpleProfile h-20">
          <Avatar
            isBordered
            color={onlineleft === "online" ? "success" : "danger"}
            src={LeftProf}
          />
          <div className="flex flex-col items-center justify-center  py-1">
            <h1 className="text-fontlight ">
              {scoreLeft} - {scoreRight}
            </h1>
            <h1 className="text-fontlight font-extrabold text-lg"> VS </h1>
          </div>
          <Avatar
            isBordered
            color={onlineright === "online" ? "success" : "danger"}
            src={RightProf}
          />
        </div>
      )}
    </>
  );
};
export default LiveGameRec;
