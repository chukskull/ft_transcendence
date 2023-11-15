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
  const [error, setError] = useState("");
  // const { isLoading, data } = useQuery("data", async () => {
  //   return getDataProfile().catch((err) => {
  //     setError(err.message);
  //   });
  // });
  {
    /*NOTICE3  Ok getting the data users form data prop and rest is so obvious*/
  }
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
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 &&
        data &&
        data?.friends?.map((user, index) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-center"
          >
            <ProfileComp
              img={user.avatarUrl}
              nickName={user.nickName}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </div>
        ))}

      {index === 1 &&
        data &&
        data?.userLastScore?.map((data, index) => (
          <LiveGameRec
            key={index}
            LeftProf={data.imageLeft}
            RightProf={data.imageRight}
            scoreLeft={data.scoreLeft}
            scoreRight={data.scoreRight}
            boolBut={false}
          />
        ))}

      {index === 2 &&
        data &&
        data?.Channels?.map((channel, index) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex items-center justify-center"
          >
            <ProfileComp
              img={""}
              nickName={getChannelStatus(channel)}
              firstName={channel.name}
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
