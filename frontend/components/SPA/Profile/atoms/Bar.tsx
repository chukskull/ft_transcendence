"use client";
import { Progress } from "@nextui-org/react";
import React from "react";

interface BarProps {
  value: number;
}

export const Bar = ({ value }: BarProps) => {
  return (
    <div className="">
      <Progress
        size="md"
        value={value}
        classNames={{
          base: "",
          indicator:
            "bg-gradient-to-r from-fuchsia-900 via-pink-800 to-fuchsia-950",
        }}
      />
    </div>
  );
};

export default Bar;
