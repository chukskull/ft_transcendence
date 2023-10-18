import React from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";
import { useQuery } from "react-query";

import { getDataProfile } from "@/api/getDataProfile";

interface MiddleComponentProps {
  index: number;
}

export const MiddleComponent = ({ index }: MiddleComponentProps) => {
  const { isLoading, data, error } = useQuery("data", async () => {
    return getDataProfile();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 &&
        data &&
        data.user.map((user, index) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex justify-center"
          >
            <ProfileComp
              img={user.img}
              nickName={user.nickName}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </div>
        ))}

      {index === 1 &&
        data &&
        data.fakeData.map((data, index) => (
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
        data.Channels.map((channel, index) => (
          <div
            key={index}
            className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex justify-center"
          >
            <ProfileComp
              img={channel.img}
              nickName={channel.nickName}
              firstName={channel.name}
            />
          </div>
        ))}
    </div>
  );
};

export default MiddleComponent;
