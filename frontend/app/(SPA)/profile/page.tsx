"use client";
import Circle from "@/components/SPA/Profile/atoms/Circle";
import LeftProfile from "@/components/SPA/Profile/sections/LeftProfile";
import { ProgressBar } from "@/components/SPA/Profile/sections/ProgressBar";
import { Progress as Progress1 } from "@nextui-org/react";
import { Progress as Progress2 } from "antd";
import React from "react";
import { FaUser } from "react-icons/fa";
const Saleh: string = "Saleh Nagat";
interface ProfileProps {
  name: string;
  image: string;
  lvl: number;
  nickName: string;
}
export default function Profile({ name, image, nickName, lvl }: ProfileProps) {
  name = Saleh;
  nickName = "hamza_lkr";
  image = "https://i.pravatar.cc/300?img=1";
  lvl = 69;
  return (
    <div className="Parent max-w-[1536px] m-auto">
      <h1 className="text-white text-2xl font-normal">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome, {name}
        </span>
      </h1>
      <div className="item-1  relative">
        <LeftProfile image={image} name={name} nickName={nickName} />
        <ProgressBar lvl={lvl} exp={1333} maxExp={12798} />
        <Circle perc={70} />
      </div>
      <div className="item-2">
        <div className="C-1"></div>
        <div className="C-2"></div>
        <div className="C-3"></div>
      </div>
    </div>
  );
}
