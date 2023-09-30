"use client";
import { Avatar } from "@nextui-org/react";
import React from "react";

interface LiveGameRecProps {
  LeftProf: string;
  RightProf: string;
  scoreLeft: number;
  scoreRight: number;
}

export const LiveGameRec = ({
  LeftProf,
  RightProf,
  scoreLeft,
  scoreRight,
}: LiveGameRecProps) => {
  return (
    <div className="flex items-center justify-around flex-grow px-8 border-1 border-white rounded-xl">
      <Avatar isBordered color="success" src={LeftProf} />
      <div className="flex flex-col items-center justify-center  py-1">
        <h1 className="text-white ">
          {scoreLeft} - {scoreRight}
        </h1>
        <h1 className="text-white font-extrabold text-lg"> VS </h1>
        <div className="flex justify-center px-1 bg-live rounded">
          <h1 className="text-white font-semibold text-center text-base">
            {" "}
            Watch{" "}
          </h1>
        </div>
      </div>
      <Avatar isBordered color="success" src={RightProf} />
    </div>
  );
};
