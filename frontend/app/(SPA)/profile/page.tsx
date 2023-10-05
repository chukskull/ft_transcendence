"use client";
import Circle from "@/components/SPA/Profile/atoms/Circle";
import { InFosPlayer } from "@/components/SPA/Profile/atoms/InFosPlayer";

import LeftProfile from "@/components/SPA/Profile/molecules/LeftProfile";
import ProfileComp from "@/components/SPA/Profile/molecules/ProfileComp";
import { ProgressBar } from "@/components/SPA/Profile/molecules/ProgressBar";
import Stats from "@/components/SPA/Profile/molecules/Stats";
import MiddleComponent from "@/components/SPA/Profile/organisms/MiddleComponent";
import { SpaceCompactItemContext } from "antd/es/space/Compact";
import React, { useState } from "react";
import { act } from "react-dom/test-utils";
import { FaUser } from "react-icons/fa";
const Saleh: string = "Saleh Nagat";
interface ProfileProps {
  name: string;
  image: string;
  lvl: number;
  nickName: string;
}
export default function Profile({ name, image, nickName, lvl }: ProfileProps) {
  name = Saleh;
  nickName = "hamza_lkr";
  image = "https://i.pravatar.cc/300?img=1";
  lvl = 69;
  const names = ["Friends", "Match History", "Channels"];
  const [active, setActive] = useState(0);

  function handleActive(index: number) {
    setActive(index);
  }

  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="font-custom text-white text-2xl font-ClashGrotesk-Regular">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome, {name}
        </span>
      </h1>
      <div className="item-1  relative ">
        <LeftProfile image={image} name={name} nickName={nickName} />
        <div className="min-w-[80px] h-0"></div>
        <ProgressBar lvl={lvl} exp={1333} maxExp={12798} />
        <Stats perc={69} money={6969} matches={420} />
      </div>

      <div className="item-2">
        <div className="C-1" style={{ overflow: "auto" }}>
          <div className="flex items-center justify-center">
            <h1 className="opacity-90 font-ClashGrotesk-Medium text-lg text-white  p-2">
              Leaderboard
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
            {user.map((user, index) => (
              <div
                key={index}
                className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex  justify-center"
              >
                <h1 className="text-center text-white  font-ClashGrotesk-Semibold text-lg flex items-center pr-12">
                  #{index + 1}
                </h1>
                <ProfileComp
                  // key={index}
                  img={user.img}
                  nickName={user.nickName}
                  firstName={user.firstName}
                  lastName={user.lastName}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="C-2 " style={{ overflow: "auto" }}>
          <div className="flex item-center justify-evenly">
            {names.map((name, index) => (
              <InFosPlayer
                key={index}
                whenClick={() => handleActive(index)}
                text={name}
                active={active === index}
              />
            ))}
          </div>

          <MiddleComponent index={active} />
        </div>
        <div className="C-3">
          <div className="flex items-center justify-center">
            <h1 className="opacity-90 font-ClashGrotesk-Medium text-lg text-white  p-2">
              Archivements
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

const user = [
  {
    img: "https://i.pravatar.cc/300?img=1",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=2",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=3",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=4",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=5",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=6",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=7",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=8",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=9",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
];
