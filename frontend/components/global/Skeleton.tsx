import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

interface SkeletonCompProps {
  width?: string;
  height?: string;
  large?: number;
}

export const SkeletonComp = ({ width, height, large }: SkeletonCompProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 ">
        {[...Array(large || 1)].map((e, i) => (
          <div key={i} className="w-auto  flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12 bg-purple-600" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg bg-purple-600" />
              <Skeleton className="h-3 w-4/5 rounded-lg bg-purple-600" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
