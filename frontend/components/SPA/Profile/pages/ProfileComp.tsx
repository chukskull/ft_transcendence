"use client";
import { InFosPlayer } from "@/components/SPA/Profile/atoms/InFosPlayer";
import LeftProfile from "@/components/SPA/Profile/molecules/LeftProfile";
import { ProgressBar } from "@/components/SPA/Profile/molecules/ProgressBar";
import Stats from "@/components/SPA/Profile/molecules/Stats";
import MiddleComponent from "@/components/SPA/Profile/organisms/MiddleComponent";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import Leadrboard from "../organisms/Leadrboard";
import axios from "axios";

function friendStatus(pendingFrReq: any, friendsList: any, userId: any) {
  // if friend return 1 if pending return 2 if not return 0
  if (friendsList?.length > 0) {
    let friend = friendsList?.find((e: any) => e.id === userId);
    if (friend) return 1;
  }
  if (pendingFrReq?.length > 0) {
    let pending = pendingFrReq?.find((e: any) => e.id === userId);
    if (pending) return 2;
  }
  return 0;
}

export default function Profile({ id }: any) {
  const [myData, setMyData] = useState<any>(null);
  const names = ["Friends", "Match History", "Channels"];
  const [active, setActive] = useState(0);

  function handleActive(index: number) {
    setActive(index);
  }
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
        withCredentials: true,
      })
      .then((res) => {
        setMyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const { isLoading, error, data } = useQuery("userList", async () => {
    return getUserProfile(id);
  });

  if (error) return "An error has occurred: " + error;
  if (isLoading) return "Loading...";
  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="font-custom text-white text-2xl font-ClashGrotesk-Regular">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome,{" "}
          {data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : ``}
        </span>
      </h1>
      <div className="item-1  relative ">
        <LeftProfile
          image={
            data?.avatarUrl
              ? data?.avatarUrl
              : "https://i.pravatar.cc/300?img=9"
          }
          name={
            data.firstName && data.lastName
              ? `${data.firstName} ${data.lastName}`
              : `No One`
          }
          nickName={data?.nickName}
          userId={data?.id}
          me={id == "me" ? true : false}
          isFriend={friendStatus(
            myData?.pendingFriendRequests,
            myData?.friends,
            data?.id
          )}
        />
        <div className="min-w-[80px] h-0"></div>
        <ProgressBar
          prec={data?.experience / 1098 + data?.level * 100}
          lvl={data?.level}
          exp={data?.expersience}
          maxExp={1098}
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
            {/* LOCALHOST: */}
          </div>
        </div>
      </div>
    </div>
  );
}
