import React from "react";
import { AddFriend } from "../atoms/AddFriend";
import { SkeletonComp } from "@/components/global/Skeleton";

interface LeftProfileProps {
  isLoading?: boolean;
  image: string;
}

export const LeftProfile = ({ image, isLoading }: LeftProfileProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  if (isLoading) return <SkeletonComp large={9} />;
  return (
    <div className="profile-user">
      <div className="hex">
        <div className="hex-background">
          <img src={image} alt="profile" />
        </div>
      </div>
    </div>
  );
};

export default LeftProfile;
