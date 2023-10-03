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
        className="h-4"
        size="lg"
        radius="sm"
        value={value}
        classNames={{
          base: "",
          indicator: "bg-gradient-to-r from-live  to-customPurple to-95%",
        }}
      />
    </div>
  );
};

export default Bar;
