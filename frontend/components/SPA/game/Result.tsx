import React from "react";
import { ProgressBar } from "../Profile/molecules/ProgressBar";
import { Avatar, Progress } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ResultProps {
  name: string;
  scoreleft: number;
  scoreright: number;
  result: "You Won" | "You Lost";
  img: string;
  value: number;
}

export const Result = ({
  name,
  scoreleft,
  scoreright,
  result,
  img,
  value,
}: ResultProps) => {
  const color = result === "You Won" ? "text-emerald-500" : "text-red-700";
  const router = useRouter();
  if (value === 100) {
    router.back();
  }
  return (
    <div className="flex flex-col items-center justify-center bg-modalBackground  gap-4  p-10 rounded-[4rem] w-[312px]">
      <h1 className={`text-3xl font-ClashGrotesk-Medium ${color} mb-5`}>
        {result}
      </h1>

      <Avatar alt="playerAvatar" src={img} className="h-28 w-28" />
      <h1 className="text-2xl font-ClashGrotesk-Regular text-fontlight">
        {name}
      </h1>

      <div className="flex flex-row items-center justify-evenly w-[112px]">
        <div>
          <h1 className="text-2xl font-bold text-fontlight">{scoreleft}</h1>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-fontlight">:</h1>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-fontlight">{scoreright}</h1>
        </div>
      </div>

      <Progress
        aria-label="Downloading..."
        size="md"
        value={value}
        color="primary"
        showValueLabel={true}
        className="w-3/4"
      />
    </div>
  );
};
export default Result;
