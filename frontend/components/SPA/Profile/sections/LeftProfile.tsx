import React from "react";

interface LeftProfileProps {
  image: string;
  name: string;
  nickName: string;
}

export const LeftProfile = ({ image, name, nickName }: LeftProfileProps) => {
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
      </div>
    </div>
  );
};

export default LeftProfile;
