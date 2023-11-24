import React, { useState } from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";
import { useQuery } from "react-query";
import { getDataProfile } from "@/utils/getDataProfile";
import { Skeleton } from "antd";
import { SkeletonComp } from "@/components/global/Skeleton";
import { get } from "http";

interface MiddleComponentProps {
  index: number;
  data: any;
  isLoading: boolean;
}

export const MiddleComponent = ({
  index,
  data,
  isLoading,
}: MiddleComponentProps) => {
  const getChannelStatus = (channel: any) => {
    if (channel.isPrivate) {
      return "Private";
    } else if (channel.is_protected) {
      return "Protected";
    } else {
      return "Public";
    }
  };
  if (isLoading)
    return (
      <div className="flex flex-col  gap-4 m-6">
        <SkeletonComp large={10} />
      </div>
    );
  const friends = data?.friends;
  const matches = data?.matchHistory;
  const Channels = data?.channels;
  console.log("this is channel", Channels);
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 &&
        data &&
        friends?.map((user: any) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-center"
          >
            <ProfileComp
              img={user.avatarUrl}
              nickName={user.nickName}
              firstName={user.firstName}
              lastName={user.lastName}
              channelId={user.id}
              id={user.id}
            />
          </div>
        ))}

      {index === 1 &&
        data &&
        matches?.map((match: any) => (
          <LiveGameRec
            key={index}
            LeftProf={match.player1.avatarUrl}
            RightProf={match.player2.avatarUrl}
            scoreLeft={1}
            scoreRight={2}
            boolBut={false}
          />
        ))}

      {index === 2 &&
        data &&
        Channels?.map((channel: any) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-center"
          >
            <ProfileComp
              img={""}
              nickName={getChannelStatus(channel)}
              firstName={channel.name}
              channelId={channel.id}
              type={
                getChannelStatus(channel) === "Public"
                  ? "Public"
                  : getChannelStatus(channel) === "Protected"
                  ? "Protected"
                  : null
              }
            />
          </div>
        ))}
    </div>
  );
};

export default MiddleComponent;
