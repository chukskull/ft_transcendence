import React, { useState } from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";
import { useQuery } from "react-query";
import { Skeleton } from "antd";
import { SkeletonComp } from "@/components/global/Skeleton";

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
  const Friends = data?.friends;
  const Matches = data?.matchHistory;
  const Channels = data?.channels;
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 && !Friends?.length && (
        <div className=" text-gray-500 text-center text-lg font-medium ">
          No friends found.
        </div>
      )}

      {index === 0 &&
        data &&
        Friends?.map((user: any) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-normal px-20"
          >
            <ProfileComp
              img={user.avatarUrl}
              nickName={user.nickName}
              firstName={user.firstName}
              lastName={user.lastName}
              channelId={user.id}
              status={user.status}
            />
          </div>
        ))}

      {index === 1 && !Matches && (
        <div className="text-center text-lg font-medium text-gray-500">
          No match history found.
        </div>
      )}

      {index === 1 &&
        data &&
        Matches?.map((match: any) => (
          <LiveGameRec
            key={index}
            LeftProf={match.player1.avatarUrl}
            RightProf={match.player2.avatarUrl}
            scoreLeft={match.player1Score}
            scoreRight={match.player2Score}
            onlineleft={match.player1.status}
            onlineright={match.player2.status}
            boolBut={false}
          />
        ))}

      {index === 2 && !Channels && (
        <div className="text-center text-lg font-medium text-gray-500">
          No channels found.
        </div>
      )}

      {index === 2 &&
        data &&
        Channels?.map((channel: any) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-start px-20"
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
