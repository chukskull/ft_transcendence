import React, { use, useEffect, useState } from "react";
import { AddFriend } from "../atoms/AddFriend";
import { set } from "react-hook-form";
import { SkeletonComp } from "@/components/global/Skeleton";

interface LeftProfileProps {
  isLoading?: boolean;
  image: string;
  name: string;
  nickName: string;
}

export const LeftProfile = ({
  image,
  name,
  nickName,
  isLoading,
}: LeftProfileProps) => {
  const [add, setAdd] = useState(false);
  function handleClick() {
    setAdd(!add);
  }
  if (isLoading) return <SkeletonComp large={9} />;
  return (
    <div className="profile-user  ">
      <div className="hex">
        <div className="hex-background">
          <img src={image} alt="profile" />
        </div>
      </div>
      <div className="flex flex-col pt-6">
        <h1 className="text-white font-ClashGrotesk-Semibold text-2xl">
          {name}
        </h1>
        <h1 className="font-ClashGrotesk-Medium  text-white opacity-80">
          #{nickName}
        </h1>
        <AddFriend
          //depends its my profile or not
          display={true}
          whenClicked={handleClick}
          clicked={add}
        />
      </div>
    </div>
  );
};

export default LeftProfile;
