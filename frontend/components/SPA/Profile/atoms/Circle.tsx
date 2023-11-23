import { Progress } from "antd";
import React from "react";

interface CircleProps {
  perc: number;
}

export const Circle = ({ perc }: CircleProps) => {
  return (
    <div className="flex flex-col gap-8">
      <Progress
        style={{ background: "#851487", borderRadius: "50%" }}
        type="circle"
        percent={perc}
        status="active"
        strokeColor={"#F417C4"}
        showInfo={false}
        size={75}
        trailColor="none"
      />
    </div>
  );
};

export default Circle;
