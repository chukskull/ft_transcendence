import { Checkbox } from "@nextui-org/react";
import React from "react";
import { MatchButton } from "../atoms/MatchButton";

export const MatchMaking = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-7 mb-4">
      <h1 className="text-white font-bold text-2xl text-center">
        {" "}
        SELECT GAME:
      </h1>
      <div className="flex flex-row justify-center items-center">
        <Checkbox defaultSelected data-hover data-focus className="ml-6">
          <span className="text-white">Normal game</span>
        </Checkbox>
        <Checkbox defaultSelected data-hover data-focus className="ml-6">
          <span className="text-white">Ranked game</span>
        </Checkbox>
      </div>
      <MatchButton />
    </div>
  );
};
