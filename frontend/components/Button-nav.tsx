"use client";
import React, { useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";


export const ButtonNav = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <>
    <button
      type="button"
      className={`flex items-center z-10 justify-between border-2 border-purple-600 
      rounded-2xl bg-none font-[ClashGrotesk-Medium] text-[15px]
      py-[14px] px-[16px] text-sm font-medium text-gray-500 transition group 
      ${isHovered ? "text-white" : ""}
      `}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      Play Now
      <span className={`ml-3 ${isHovered ? " transition group-hover:translate-x-1.5" : ""}`}>
        <BiRightArrowAlt size={20}  style={{ color: "none" }} />
      </span>
    </button>
    </>
    
  );
};

export default ButtonNav;
