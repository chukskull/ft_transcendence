import React from "react";
import Circle from "../atoms/Circle";
import Image from "next/image";

interface rankMap {
  [key: string]: string;
}

const rankMap: rankMap = {
  Silver: "https://i.imgur.com/OazydMA.png",
  Gold: "https://imgur.com/I8ctvsh.png",
  Iron: "https://i.imgur.com/GMh5g0V.png",
  Bronze: "https://i.imgur.com/JTbrxcF.png",
};
interface StatsProps {
  perc: number;
  rank?: string | undefined;

  matches: number;
}

export const Stats = ({ perc, rank, matches }: StatsProps) => {
  const [IsDes, setIsDes] = React.useState<boolean>(window.innerWidth > 840);
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 840) {
        setIsDes(false);
      } else {
        setIsDes(true);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex    items-center lg:gap-2 flex-row md:gap-2">
      <div className="flex flex-col items-center  justify-between  lg:w-[150px] lg:h-[150px]  w-[100px] h-[100px]">
        <Circle perc={perc ? perc : 0} size={IsDes ? 75 : 50} />
        <h1 className=" text-white lg:font-ClashGrotesk-Medium lg:text-xl text-sm font-ClashGrotesk-Regular">
          {perc ? perc : 0}%
        </h1>
        <h1 className=" text-white lg:font-ClashGrotesk-Regular lg:text-lg text-sm font-ClashGrotesk-Light">
          Win Rate
        </h1>
      </div>
      <div className="flex flex-col items-center  justify-between  lg:w-[150px] lg:h-[150px]  w-[100px] h-[100px] ">
        <Image
          src={rank ? rankMap[rank] : rankMap["Iron"]}
          width={IsDes ? 75 : 50}
          height={IsDes ? 75 : 50}
          alt="rank"
        />
        <h1 className=" text-white lg:font-ClashGrotesk-Medium lg:text-xl text-sm font-ClashGrotesk-Regular">
          {rank ? rank : "Iron"}
        </h1>
        <h1 className=" text-white lg:font-ClashGrotesk-Regular lg:text-lg text-sm font-ClashGrotesk-Light">
          Ranking
        </h1>
      </div>

      <div className="flex flex-col items-center  justify-between  lg:w-[150px] lg:h-[150px] w-[100px] h-[100px]">
        <Image
          src="/assets/SPA/Profile/Punch.png"
          width={IsDes ? 75 : 50}
          height={IsDes ? 75 : 50}
          alt="punch"
        />
        <h1 className=" text-white lg:font-ClashGrotesk-Medium lg:text-xl text-sm font-ClashGrotesk-Regular">
          {matches}
        </h1>
        <h1 className=" text-white lg:font-ClashGrotesk-Regular lg:text-lg text-sm font-ClashGrotesk-Light">
          Matches played
        </h1>
      </div>
    </div>
  );
};

export default Stats;
