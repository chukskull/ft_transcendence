import React from "react";
import Bar from "../atoms/Bar";

interface ProgressBarProps {
  lvl: number;
  exp: number;
  maxExp: number;
}
export const ProgressBar = ({ lvl, exp, maxExp }: ProgressBarProps) => {
  if (exp === undefined) exp = 0;
  return (
    <div className="flex flex-col justify-center gap-2  w-[40%] py-4">
      <div className="flex items-center justify-between">
        <h1 className=" text-fontlight lg:font-ClashGrotesk-Regular lg:text-base  font-ClashGrotesk-Light text-sm">
          Level {lvl}
        </h1>
        <h1 className=" text-fontlight opacity-80 font-ClashGrotesk-Light text-xs ">
          {exp}/{maxExp + lvl * 100}
        </h1>
      </div>
      <Bar value={(exp / (maxExp + lvl * 100)) * 100} />
      <div className="flex items-center justify-between">
        <h1 className=" text-fontlight font-ClashGrotesk-Light text-xs ">
          Next level
        </h1>
        <h1 className=" text-fontlight opacity-80 font-ClashGrotesk-Light text-xs">
          {" "}
          Level {lvl + 1}
        </h1>
      </div>
    </div>
  );
};
