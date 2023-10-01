import React from "react";
import { FaUser } from "react-icons/fa";
const Saleh: string = "Saleh Nagat";
interface ProfileProps {
  name: string;
}
export default function Profile({ name }: ProfileProps) {
  name = Saleh;
  return (
    <div className="Parent">
      <h1 className="text-white text-2xl font-normal">
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "0.5rem" }} /> Welcome, {name}
        </span>
      </h1>
      <div className="item-1"></div>
      <div className="item-2">
        <div className="C-1"></div>
        <div className="C-2"></div>
        <div className="C-3"></div>
      </div>
    </div>
  );
}
