import { Button } from "@nextui-org/react";
import React from "react";

export const MatchButton = () => {
  return (
    <div>
      <Button
        className="bg-live text-white font-semibold text-base max-w-[239px] transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-80"
        data-hover
        data-focus
      >
        JOIN MATCHMAKING
      </Button>
    </div>
  );
};
