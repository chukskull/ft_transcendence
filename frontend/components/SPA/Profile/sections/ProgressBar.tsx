import React from "react";
import Bar from "../atoms/Bar";

interface ProgressBarProps {
  lvl: number;
  exp: number;
  maxExp: number;
}
export const ProgressBar = ({ lvl, exp, maxExp }: ProgressBarProps) => {
  return (
    <div className="flex flex-col justify-center gap-3 flex-grow max-w-[302px]">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-normal text-base ">Level {lvl}</h1>
        <h1 className="text-white opacity-80 font-light text-xs">
          {exp}/{maxExp}
        </h1>
      </div>
      <Bar value={lvl} />
      <div className="flex items-center justify-between">
        <h1 className="text-white font-light text-xs ">Next level</h1>
        <h1 className="text-white opacity-80 font-light text-xs"> {lvl + 1}</h1>
      </div>
    </div>
  );
};
