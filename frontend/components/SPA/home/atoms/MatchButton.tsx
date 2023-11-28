import { Button } from "@nextui-org/react";
import React from "react";
import io from "socket.io-client";

export const MatchButton = () => {
  const handleJoinQueue = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gameSocket`);
    if (!socket) {
      return;
    }
    socket.emit("joinQueue");
  };

  return (
    <div>
      <Button
        className="bg-live text-white font-semibold text-base max-w-[239px] transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-80"
        data-hover
        data-focus
        onClick={handleJoinQueue}
      >
        JOIN MATCHMAKING
      </Button>
    </div>
  );
};
