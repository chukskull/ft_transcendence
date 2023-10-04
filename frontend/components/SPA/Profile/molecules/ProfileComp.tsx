import { Avatar } from "@nextui-org/react";
import React from "react";

interface ProfileCompProps {
  key?: number;
  img: string;
  nickName: string;
  firstName: string;
  lastName: string;
}

const ProfileComp = ({
  key,
  img,
  nickName,
  firstName,
  lastName,
}: ProfileCompProps) => {
  return (
    <div className="flex items-center  gap-5">
      <Avatar isBordered color="success" src={img} />
      <div className="m-0 p-0">
        <h4 className="text-white font-ClashGrotesk-Medium text-base m-0 p-0">
          {firstName} {lastName}
        </h4>
        <h6 className="text-white font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0">
          #{nickName}
        </h6>
      </div>
    </div>
  );
};

export default ProfileComp;
