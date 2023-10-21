import React, { useState } from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";
import { useQuery } from "react-query";

import { getDataProfile } from "@/api/getDataProfile";

interface MiddleComponentProps {
  index: number;
}

export const MiddleComponent = ({ index }: MiddleComponentProps) => {
  const [error, setError] = useState("");
  const { isLoading, data } = useQuery("data", async () => {
    return getDataProfile().catch((err) => {
      setError(err.message);
    });
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <h2>{error}</h2>;
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0 &&
        data &&
        data?.userFriends?.map((user, index) => (
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
        data?.userChannels?.map((channel, index) => (
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
