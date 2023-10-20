import React from "react";
import Circle from "../atoms/Circle";
import Image from "next/image";

interface rankMap {
  [key: string]: string;
}

interface StatsProps {
  perc: number;
  rank?: rankMap;
  money: number;
  matches: number;
}

/*
color: #FFF;
leading-trim: both;
text-edge: cap;
font-family: Clash Grotesk;
font-size: 14px;
font-style: ClashGrotesk-Regular;
font-weight: 400;
line-height: 46.209px; /* 330.064% */

export const Stats = ({ perc, rank, money, matches }: StatsProps) => {
  return (
    <div className="flex   items-center gap-16">
      <div className="flex flex-col items-center  justify-between gap-2">
        <Circle perc={perc} />
        <h1 className=" text-white font-ClashGrotesk-Medium text-xl ">
          {perc}%
        </h1>
        <h1 className=" text-white font-ClashGrotesk-Regular text-lg">
          Win Rate
        </h1>
      </div>
      <div className="flex flex-col items-center  justify-between gap-2">
        <Image
          src="/assets/SPA/Profile/rank[2].svg"
          width={74}
          height={82}
          alt="rank"
        />
        <h1 className=" text-white font-ClashGrotesk-Medium text-xl">SILVER</h1>
        <h1 className=" text-white font-ClashGrotesk-Regular text-lg">
          Ranking
        </h1>
      </div>
      <div className="flex flex-col items-center  justify-between gap-2">
        <Image
          src="/assets/SPA/Profile/Money.png"
          width={88}
          height={80}
          alt="money"
        />
        <h1 className=" text-white font-ClashGrotesk-Medium text-xl">
          {money}$
        </h1>
        <h1 className=" text-white font-ClashGrotesk-Regular text-lg">
          Cash earned
        </h1>
      </div>
      <div className="flex flex-col items-center  justify-between gap-2">
        <Image
          src="/assets/SPA/Profile/Punch.png"
          width={84}
          height={76}
          alt="punch"
        />
        <h1 className=" text-white font-ClashGrotesk-Medium text-xl">
          {matches}
        </h1>
        <h1 className=" text-white font-ClashGrotesk-Regular text-lg">
          Matches played
        </h1>
      </div>
    </div>
  );
};

export default Stats;
