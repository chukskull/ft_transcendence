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
    <div className="flex items-center justify-center mt-4 gap-3">
      <button className="group flex items-center" onClick={whenClicked}>
        <div
          className="flex h-12 w-12 rounded-[24px] 
        group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 
        group-hover:bg-emerald-500"
        >
          {!clicked ? (
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          ) : (
            <Check
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          )}
        </div>
      </button>
      {!clicked ? (
        <h1 className="text-white font-ClashGrotesk-Medium text-lg group-hover:text-white transitio opacity-80">
          Add Friend
        </h1>
      ) : (
        <h1 className="text-white font-ClashGrotesk-Medium text-lg group-hover:text-white transitio opacity-80">
          Friend Request Sent
        </h1>
      )}
    </div>
  );
};
