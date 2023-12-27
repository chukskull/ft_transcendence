"use client";
import { InFosPlayer } from "@/components/SPA/Profile/atoms/InFosPlayer";
import LeftProfile from "@/components/SPA/Profile/molecules/LeftProfile";
import { ProgressBar } from "@/components/SPA/Profile/molecules/ProgressBar";
import Stats from "@/components/SPA/Profile/molecules/Stats";
import MiddleComponent from "@/components/SPA/Profile/organisms/MiddleComponent";
import Achievement from "@/components/SPA/Profile/organisms/Achievement";
import React, { useState, useEffect } from "react";
import { FaUser, FaUserAltSlash } from "react-icons/fa";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import Leadrboard from "../organisms/Leadrboard";
import axios from "axios";
import { AddFriend } from "../atoms/AddFriend";
import Error from "next/error";
import { Button } from "@nextui-org/react";

function friendStatus(
  theirpendingFrReq: any,
  mypendingFrReq: any,
  friendsList: any,
  userId: number,
  myId: number
) {
  // if friend return 1 if pending return 2 if not return 0
  if (friendsList?.length > 0) {
    let friend = friendsList?.find((e: any) => e.id == userId);
    if (friend) return 1;
  }
  if (mypendingFrReq?.length > 0) {
    let pending = mypendingFrReq?.find((e: any) => e.id == userId);
    if (pending) return 2;
  }
  if (theirpendingFrReq?.length > 0) {
    let pending = theirpendingFrReq?.find((e: any) => e.id == myId);
    if (pending) return 2;
  }

  return 0;
}

const truncateText = (text: string, maxLength: number) => {
  if (text?.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export default function Profile({ id }: any) {
  console.log("this is the id", id);
  const [myData, setMyData] = useState<any>(null);
  const names = ["Friends", "Match History", "Channels"];
  const [active, setActive] = useState(0);
  function isBlocked() {
    if (myData?.blockedUsers?.length > 0) {
      let blocked = myData?.blockedUsers?.find((e: any) => e.nickName === id);

      if (blocked) return true;
    }
    return false;
  }

  function handleActive(index: number) {
    setActive(index);
  }

  function handleBlock(blockUnblock: number) {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleBlock/${data?.id}/${blockUnblock}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }
  const friends = useQuery("userFriends", async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`,
      {
        withCredentials: true,
      }
    );
    return response;
  });
  useEffect(() => {
    if (friends.data) {
      setMyData(friends.data?.data);
    }
  }, [friends.data]);
  const { isLoading, error, data }: any = useQuery("userList", async () => {
    return getUserProfile(id);
  });
  if (error) {
    console.log("ihave an error for sure");
    return <Error statusCode={404} />;
  }
  if (isLoading) return "Loading...";
  return (
    <div className="Parent max-w-[1536px] m-auto">
      {id === "me" ? (
        <h1 className="font-custom text-fontlight text-2xl font-ClashGrotesk-Regular truncate">
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaUser style={{ marginRight: "0.5rem" }} /> Welcome,{" "}
            {data?.firstName && data?.lastName
              ? `${data?.firstName} ${data?.lastName}`
              : ``}
          </span>
        </h1>
      ) : (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => handleBlock(isBlocked() ? 0 : 1)}
            color={"danger"}
            variant="bordered"
            className="w-fit"
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <FaUserAltSlash style={{ marginRight: "0.5rem" }} />{" "}
              {isBlocked() ? "Unblock" : "Block"}
            </span>
          </Button>
        </div>
      )}
      <div className={`${id === "me" ? "item-1-me" : "item-1"}`}>
        <LeftProfile
          image={
            data?.avatarUrl
              ? data?.avatarUrl
              : "https://i.pravatar.cc/300?img=9"
          }
        />
        <div className="">
          <h1 className="text-fontlight xl:font-ClashGrotesk-Semibold xl:text-2xl font-ClashGrotesk-Medium text-xl text-center md:text-start md:mt-10">
            {truncateText(
              data?.firstName && data?.lastName
                ? `${data?.firstName} ${data?.lastName}`
                : `No One`,
              15
            )}
          </h1>
          <h1 className="font-ClashGrotesk-Medium text-fontlight opacity-80 text-center md:text-start">
            #{truncateText(data?.nickName, 10)}
          </h1>
          <AddFriend
            display={id == "me" ? true : false}
            userId={data?.id}
            isFriend={friendStatus(
              data?.pendingFriendRequests,
              myData?.pendingFriendRequests,
              myData?.friends,
              data?.id,
              myData?.id
            )}
          />
        </div>

        <ProgressBar lvl={data?.level} exp={data?.experience} maxExp={1098} />
        <Stats
          perc={
            data?.totaxlames === 0 ? 0 : (data?.wins / data?.totalGames) * 100
          }
          matches={data?.totalGames}
          rank={data?.rank}
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

          <Achievement data={data?.achievements} />
        </div>
      </div>
    </div>
  );
}

// name: string;
// @IsString()
// @IsNotEmpty()
// description: string;
// @IsString()
// @IsNotEmpty()
// icon: string;
// @IsNumber()
// @IsNotEmpty()
// addedXp: number;
