import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";


export const ButtonNav = () => {
  return (
    <button
      type="button"
      className="button flex items-center justify-between font-[ClashGrotesk-Medium']  text-[15px] h-[44px] w-[120px] 
      py-[14px] px-[16px]  text-sm font-medium text-white focus:outline-none rounded-2xl border border-purple-800 border-transparent
       hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700  dark:text-gray-400
        dark:border-purple-800 dark:hover:text-white dark:hover:bg-gray-700"
    >
      Play Now 
      <span className="ml-2"><BiRightArrowAlt /></span>
    </button>
  );
};

export default ButtonNav;
