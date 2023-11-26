"use client";

import { Button } from "@nextui-org/react";
import React from "react";

interface InFosPlayerProps {
  text: string;
  active?: boolean;
  whenClick?: () => void;
  isItprofile: boolean;
}
export const InFosPlayer = ({
  whenClick,
  text,
  active,
  isItprofile,
}: InFosPlayerProps) => {
  const string = isItprofile ? "border-b-2" : "border-b-large";
  return (
    <div className="bg-none">
      <Button
        onClick={whenClick}
        className={`bg-inherit opacity-90 font-ClashGrotesk-Medium text-lg text-white border-1  border-x-0 border-y-0 rounded-none ${
          active ? string : "border-b-0"
        }`}
      >
        {text}
      </Button>
    </div>
  );
};

export default InFosPlayer;
