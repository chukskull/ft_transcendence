import React from "react";
import Bar from "../atoms/Bar";

interface ProgressBarProps {
  lvl: number;
  exp: number;
  maxExp: number;
}
export const ProgressBar = ({ lvl, exp, maxExp }: ProgressBarProps) => {
  return (
    <div className="flex flex-col justify-center gap-3 flex-grow max-w-[384px]">
      <div className="flex items-center justify-between">
        <h1 className=" text-white font-ClashGrotesk-Regular text-base ">
          Level {lvl}
        </h1>
        <h1 className=" text-white opacity-80 font-ClashGrotesk-Light text-xs">
          {exp}/{maxExp}
        </h1>
      </div>
      <Bar value={(exp * 100) / maxExp} />
      <div className="flex items-center justify-between">
        <h1 className=" text-white font-ClashGrotesk-Light text-xs ">
          Next level
        </h1>
        <h1 className=" text-white opacity-80 font-ClashGrotesk-Light text-xs">
          {" "}
          Level {lvl + 1}
        </h1>
      </div>
    </div>
  );
};
