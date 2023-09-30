"use client";

import { Avatar, Button } from "@nextui-org/react";
import React from "react";

interface MiniProfProps {
  image: string;
  name: string;
}

export const MiniProf = ({ image, name }: MiniProfProps) => {
  return (
    <>
      <div className="flex flex-col justify-center h-[122px] items-center gap-1 w-[132px] bg-friend rounded-xl">
        <Avatar isBordered color="success" src={image} />
        <h1 className="max-w-[8ch] text-white text-base font-semibold">
          {name}{" "}
        </h1>
        <Button className="bg-live max-w-6xl h-5 text-white font-medium text-sm rounded-md">
          {" "}
          Invite{" "}
        </Button>
      </div>
    </>
  );
};

export default MiniProf;
