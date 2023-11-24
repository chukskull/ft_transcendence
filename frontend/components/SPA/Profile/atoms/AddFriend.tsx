import React from "react";
import { Plus, Check } from "lucide-react";

interface AddFriendProps {
  display: boolean;
  whenClicked: () => void;
  clicked: boolean;
}
export const AddFriend = ({
  display,
  whenClicked,
  clicked,
}: AddFriendProps) => {
  if (!display) {
    return null;
  }
  return (
    <div className="flex items-center justify-center mt-6 gap-3">
      <button className="group flex items-center" onClick={whenClicked}>
        <div
          className="flex h-12 w-12 rounded-[24px] 
        group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background bg-transparent border-3 border-green-500	
        "
        >
          {!clicked ? (
            <Plus
              className="group-hover:text-white transition text-white"
              size={25}
            />
          ) : (
            <Check
              className="group-hover:text-white transition text-white"
              size={25}
            />
          )}
        </div>
      </button>
      {!clicked ? (
        <h1 className="text-white font-ClashGrotesk-Regular text-base group-hover:text-white transitio opacity-80">
          Add Friend
        </h1>
      ) : (
        <h1 className="text-white font-ClashGrotesk-Regular text-base group-hover:text-white transitio opacity-80">
          Friend Request Sent
        </h1>
      )}
    </div>
  );
};
