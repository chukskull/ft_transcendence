import React, { useState } from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";
import { useQuery } from "react-query";
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

  
  // data = dwita; // Use the correct index to access the data from the 'dwita' array

  if (isLoading)
    return (
      <div className="flex flex-col  gap-4 m-6">
        <SkeletonComp large={10} />
      </div>
    );
      // data = dwita;
  // const friends = data?.friends;
  // const matches = data?.matches;
  // const Channels = data?.channels;
      console.log(data?.friends?.length, "ur mum");
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 &&

        !data?.friends?.length && (
          <div className=" text-gray-500 text-center text-lg font-medium ">
            No friends found.
          </div>
        )}
  
      {index === 0 && data && data?.friends?.map((user: any) => (
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
          />
        </div>
      ))}
  
      {index === 1 &&
        
        !data?.matches&& (
          <div className="text-center text-lg font-medium text-gray-500">
            No match history found.
          </div>
        )}
  
      {index === 1 && data && data?.matches?.map((match: any) => (
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
        
        !data?.Channels && (
          <div className="text-center text-lg font-medium text-gray-500">
            No channels found.
          </div>
        )}
  
      {index === 2 && data && data?.Channels?.map((channel: any) => (
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
const dwita = {
  
  "friends": [
    {
      "id": 1,
      "avatarUrl": "https://picsum.photos/200/300",
      "nickName": "CoolDude",
      "firstName": "Robert",
      "lastName": "Downey Jr."
    },
    {
      "id": 2,
      "avatarUrl": "https://picsum.photos/200/300",
      "nickName": "Radiant",
      "firstName": "Emma",
      "lastName": "Watson"
    },
    {
      "id": 3,
      "avatarUrl": "https://picsum.photos/200/300",
      "nickName": "SingingBird",
      "firstName": "Adele",
      "lastName": ""
    }
  ],
  "matches": [
    {
      "id": 1,
      "player1": {
        "id": 1,
        "avatarUrl": "https://picsum.photos/200/300",
        "nickName": "CoolDude",
        "firstName": "Robert",
        "lastName": "Downey Jr."
      },
      "player2": {
        "id": 2,
        "avatarUrl": "https://picsum.photos/200/300",
        "nickName": "Radiant",
        "firstName": "Emma",
        "lastName": "Watson"
      },
      "scoreLeft": 2,
      "scoreRight": 1
    },
    {
      "id": 2,
      "player1": {
        "id": 3,
        "avatarUrl": "https://picsum.photos/200/300",
        "nickName": "SingingBird",
        "firstName": "Adele",
        "lastName": ""
      },
      "player2": {
        "id": 1,
        "avatarUrl": "https://picsum.photos/200/300",
        "nickName": "CoolDude",
        "firstName": "Robert",
        "lastName": "Downey Jr."
      },
      "scoreLeft": 1,
      "scoreRight": 3
    }
  ],
  "channels": [
    {
      "id": 1,
      "name": "Public Channel",
      "isPrivate": false
    },
    {
      "id": 2,
      "name": "Protected Channel",
      "is_protected": true
    },
    {
      "id": 3,
      "name": "Private Channel",
      "isPrivate": true
    }
  ]
};
