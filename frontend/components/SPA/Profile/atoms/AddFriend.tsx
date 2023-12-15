import React from "react";
import { Plus, Check, Minus } from "lucide-react";
import axios from "axios";

interface AddFriendProps {
  display: boolean;
  userId: number;
  isFriend: number;
}

export const AddFriend: React.FC<AddFriendProps> = ({
  display,
  userId,
  isFriend,
}) => {
  if (display) {
    return null;
  }

  const buttonSize = "12";

  const commonIconProps = {
    className: "group-hover:text-fontlight transition text-fontlight",
    size: 25,
  };

  let icon = null;
  let buttonText = null;
  let borderColor = "border-green-500";
  switch (isFriend) {
    case 0:
      icon = <Plus {...commonIconProps} />;
      buttonText = "Add Friend";
      break;
    case 2:
      icon = <Check {...commonIconProps} />;
      buttonText = "Friend Request Sent";
      break;
    case 1:
      icon = <Minus {...commonIconProps} color="red" />;
      buttonText = "Remove Friend";
      borderColor = "border-red-500";
  }

  const handleRequest = () => {
    if (isFriend === 0) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/addFriend/${userId}`,
          { withCredentials: true }
        )
        .then(() => {
          window.location.reload();
        })
        .catch((err) => console.log(err.response.data.message));
    } else if (isFriend === 1) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/removeFriend/${userId}`,
          { withCredentials: true }
        )
        .then(() => {
          window.location.reload();
        })
        .catch((err) => console.log(err.response.data.message));
    }
  };

  return (
    <div className="flex items-center justify-center mt-6 gap-3">
      <button className="group flex items-center" onClick={handleRequest}>
        <div
          className={`flex h-${buttonSize} w-${buttonSize} rounded-[24px] 
            group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background bg-transparent border-3 ${borderColor}
          `}
        >
          {icon}
        </div>
      </button>
      <h1 className="text-fontlight font-ClashGrotesk-Regular text-base group-hover:text-fontlight transition opacity-80">
        {buttonText}
      </h1>
    </div>
  );
};
