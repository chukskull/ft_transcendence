"use client";

import { Button } from "@nextui-org/react";
import React, { useState } from "react";

interface InFosPlayerProps {
  text: string;
  active?: boolean;
  whenClick?: () => void;
}
export const InFosPlayer = ({ whenClick, text, active }: InFosPlayerProps) => {
  return (
    <div className="bg-none">
      <Button
        onClick={whenClick}
        className={`bg-inherit opacity-90 font-ClashGrotesk-Medium text-lg text-white border-1  border-x-0 border-y-0 rounded-none ${
          active ? "border-b-1" : "border-b-0"
        }`}
      >
        {" "}
        {text}
      </Button>
    </div>
  );
};

export default InFosPlayer;
