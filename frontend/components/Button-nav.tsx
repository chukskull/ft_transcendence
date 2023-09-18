import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";

export const ButtonNav = () => {
  return (
    <div className="MajorButton bg-gray-100 focus:outline-none hover:bg-gray-100 
    hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 
    dark:text-gray-400 dark:border-purple-800 dark:hover:text-white dark:hover:bg-gray-700" 
    >

      <button type="button" className=" flex items-center justify-between ">
        Play Now
        <span className="ml-2 hover:text-red-500">
          <BiRightArrowAlt />
        </span>
      </button>
    </div>
  );
};

export default ButtonNav;


