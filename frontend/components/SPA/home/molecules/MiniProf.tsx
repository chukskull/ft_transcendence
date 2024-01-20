"use client";

import { Avatar, Button } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

interface MiniProfProps {
  image: string;
  name: string;
  id: number;
}

export const MiniProf = ({ image, name, id }: MiniProfProps) => {
  const router = useRouter();
  const inviteToGame = (friendId: number) => {
    router.push(`/game?inviteToGame=${friendId}`);
  };

  return (
    <div>
      <div className="flex flex-col justify-center h-[122px] items-center gap-2 w-[120px] border-1 bg-friend rounded-xl">
        <Avatar isBordered color="success" src={image} />
        <h1 className="max-w-[8ch] text-fontlight text-base font-semibold truncate">
          {name}
        </h1>
        <Button
          className="bg-buttonbg max-w-6xl h-5 text-fontlight font-medium text-sm rounded-md transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-80"
          onClick={() => inviteToGame(id)}
        >
          Invite
        </Button>
      </div>
    </div>
  );
};

export default MiniProf;
