"use client";
import { InFosPlayer } from "@/components/SPA/Profile/atoms/InFosPlayer";
import LeftProfile from "@/components/SPA/Profile/molecules/LeftProfile";
import { ProgressBar } from "@/components/SPA/Profile/molecules/ProgressBar";
import Stats from "@/components/SPA/Profile/molecules/Stats";
import MiddleComponent from "@/components/SPA/Profile/organisms/MiddleComponent";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import Leadrboard from "../organisms/Leadrboard";

interface ProfileProps {
  id: string;
}

export default function Profile({ id }: ProfileProps) {
  const names = ["Friends", "Match History", "Channels"];
  const [active, setActive] = useState(0);

  function handleActive(index: number) {
    setActive(index);
  }
  const { isLoading, error, data } = useQuery("userList", async () => {
    {
      /*NOTICE2 this function  fetch from the api axios.get(`http://localhost:1337/api/:${id}`) id reffering of params.slug in first
      and its return the data of the user with the id example 
      "user": {
          "id": 1,
          "fullName": "${first_name} + ${last_name},
          "firstName": "John",
          "lastName": "Doe",
          "nickName": "Johny67",
          "level": 90,
          "userExp": 6399,
          "WinPerc": 90,
          "userMatches": 14, => matchHistory.length() whatever
          "avatarUrl": "https://i.pravatar.cc/300?img=9"
  },
      */
    }
    return getUserProfile(id);
  });
  console.log(data);

  if (error) return "An error has occurred: " + error.message;
  if (isLoading) return "Loading...";
  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="font-custom text-white text-2xl font-ClashGrotesk-Regular">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome,{" "}
          {`${data.firstName} + ${data.lastName}`}
        </span>
      </h1>
      <div className="item-1  relative ">
        <LeftProfile
          image={data?.avatarUrl}
          name={`${data.firstName} + ${data.lastName}`}
          nickName={data?.nickName}
        />
        <div className="min-w-[80px] h-0"></div>
        <ProgressBar
          prec={data?.expersience / 12798}
          lvl={data?.level}
          exp={data?.expersience}
          maxExp={12798}
        />
        <Stats
          perc={data?.wins / data?.totalGames}
          matches={data?.totalGames}
        />
      </div>

      <div className="item-2">
        <div
          className="C-1"
          style={{ overflow: "auto", paddingInline: "40px" }}
        >
          <h1 className="opacity-90 font-ClashGrotesk-Medium text-lg text-white  p-2 text-center">
            Leaderboard
          </h1>

          <Leadrboard MonStyle="Profile" />
        </div>

        <div className="C-2 " style={{ overflow: "auto" }}>
          <div className="flex item-center justify-evenly">
            {names.map((name, index) => (
              <InFosPlayer
                key={index}
                whenClick={() => handleActive(index)}
                text={name}
                active={active === index}
                isItprofile={true}
              />
            ))}
          </div>

          <MiddleComponent index={active} data={data} isLoading={isLoading} />
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
