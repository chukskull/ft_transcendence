"use client";
import { InFosPlayer } from "@/components/SPA/Profile/atoms/InFosPlayer";
import LeftProfile from "@/components/SPA/Profile/molecules/LeftProfile";
import { ProgressBar } from "@/components/SPA/Profile/molecules/ProgressBar";
import Stats from "@/components/SPA/Profile/molecules/Stats";
import MiddleComponent from "@/components/SPA/Profile/organisms/MiddleComponent";
import Achievement from "@/components/SPA/Profile/organisms/Achievement";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import Leadrboard from "../organisms/Leadrboard";
import axios from "axios";
import { AddFriend } from "../atoms/AddFriend";
import Error from "next/error";

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
const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

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
  if (error) {
    console.log("ihave an error for sure");
    return <Error statusCode={404} />;
  }
  if (isLoading) return "Loading...";

  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="font-custom text-fontlight text-2xl font-ClashGrotesk-Regular truncate">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome,{" "}
          {data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : ``}
        </span>
      </h1>
      <div className={`${id === "me" ? "item-1-me" : "item-1"}`}>
        <LeftProfile
          image={
            data?.avatarUrl
              ? data?.avatarUrl
              : "https://i.pravatar.cc/300?img=9"
          }
        />
        <div className="">
          <h1 className="text-fontlight xl:font-ClashGrotesk-Semibold xl:text-2xl font-ClashGrotesk-Medium text-xl ">
            {truncateText(
              data.firstName && data.lastName
                ? `${data.firstName} ${data.lastName}`
                : `No One`,
              15
            )}
          </h1>
          <h1 className="font-ClashGrotesk-Medium text-fontlight opacity-80">
            #{truncateText(data?.nickName, 10)}
          </h1>
          <AddFriend
            display={id == "me" ? true : false}
            userId={data?.id}
            isFriend={friendStatus(
              myData?.pendingFriendRequests,
              myData?.friends,
              data?.id
            )}
          />
        </div>

        <ProgressBar lvl={data?.level} exp={data?.expersience} maxExp={1098} />
        <Stats
          perc={
            data?.totaxlames === 0 ? 0 : (data?.wins / data?.totalGames) * 100
          }
          matches={data?.totalGames}
        />
      </div>

      <div className={`${id === "me" ? "item-2-me" : "item-2"}`}>
        <div
          className="C-1"
          style={{ overflow: "auto", paddingInline: "40px" }}
        >
          <h1 className="opacity-90 font-ClashGrotesk-Medium text-xl text-fontlight  p-2 text-center">
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
        <div className="C-3 overflow-y-auto w-[100%] ">
          <h1 className="opacity-90 font-ClashGrotesk-Medium text-xl text-fontlight text-center p-2 ">
            Archivements
          </h1>
          <Achievement data={data.Achievement} />
        </div>
      </div>
    </div>
  );
}
