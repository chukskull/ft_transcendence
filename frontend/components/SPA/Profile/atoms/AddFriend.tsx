import React from "react";
import { Plus, Check, Minus } from "lucide-react";

interface AddFriendProps {
  display: boolean;
  whenClicked: () => void;
  clicked: boolean;
  userId: number;
  isFriend: number;
}

export const AddFriend: React.FC<AddFriendProps> = ({
  display,
  whenClicked,
  clicked,
  userId,
  isFriend,
}) => {
  if (display) {
    return null;
  }

  const buttonSize = "12";

  const commonIconProps = {
    className: "group-hover:text-white transition text-white",
    size: 25,
  };

  let icon = null;
  let buttonText = null;
  switch (isFriend) {
    case 1:
      icon = <Plus {...commonIconProps} />;
      buttonText = "Add Friend";
      break;
    case 2:
      icon = <Check {...commonIconProps} />;
      buttonText = "Friend Request Sent";
      break;
    default:
      icon = <Minus {...commonIconProps} color="red" />;
      buttonText = "Remove Friend";
  }


  return (
    <div className="flex items-center justify-center mt-6 gap-3">
      <button className="group flex items-center" onClick={whenClicked}>
        <div
          className={`flex h-${buttonSize} w-${buttonSize} rounded-[24px] 
            group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background bg-transparent border-3 border-green-500
          `}
        >
          {icon}
        </div>
      </button>
      <h1 className="text-white font-ClashGrotesk-Regular text-base group-hover:text-white transition opacity-80">
        {buttonText}
      </h1>
    </div>
  );
};
