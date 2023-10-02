"use client";
import { Progress } from "@nextui-org/react";
import { progress } from "framer-motion";
import React from "react";
import { FaUser } from "react-icons/fa";
const Saleh: string = "Saleh Nagat";
interface ProfileProps {
  name: string;
  image: string;
  lvl: number;
}
export default function Profile({ name, image, lvl }: ProfileProps) {
  name = Saleh;
  image = "https://i.pravatar.cc/300?img=1";
  lvl = 69;
  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="text-white text-2xl font-normal">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome, {name}
        </span>
      </h1>
      <div className="item-1  relative flex justify-center items-center">
        <div className="profile-user">
          <div className="hex">
            <div className="hex-background">
              <img src={image} alt="profile" />
            </div>
          </div>
          <div className="flex flex-col pt-6">
            <h1 className="text-white font-semibold text-2xl ">{name}</h1>
            <h1 className="text-white opacity-80">#hamza_lkr</h1>
            {/* <div className="hex-2">
              <div className="hex-background-2"></div>
            </div> */}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-normal text-base ">Level {lvl}</h1>
            <h1 className="text-white opacity-80 font-light text-xs">
              3999/4000
            </h1>
          </div>
          <Progress
            // isStriped
            size="md"
            value={60}
            classNames={{
              base: "max-w-md",

              indicator:
                "bg-gradient-to-r from-customPink via-transparent to-customPurple",
            }}
          />
          <div className="flex items-center justify-between">
            <h1 className="text-white font-light text-xs ">Next level</h1>
            <h1 className="text-white opacity-80 font-light text-xs"> 70 </h1>
          </div>
        </div>
      </div>
      <div className="item-2">
        <div className="C-1"></div>
        <div className="C-2"></div>
        <div className="C-3"></div>
      </div>
    </div>
  );
}
