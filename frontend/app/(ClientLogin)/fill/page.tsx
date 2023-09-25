"use client";

import { Button, Input } from "@nextui-org/react";
import React from "react";
import "@/styles/globals.scss";

export default function Fill() {
  const variants = ["flat"];
  return (
    // <NextUIProvider>
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rectangle flex flex-col items-center justify-center gap-14">
          <Input
            isClearable
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-none",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-none",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-none",
                "group-data-[focused=true]:bg-none",
                "dark:group-data-[focused=true]:bg-none",
                "!cursor-text",
              ],
            }}
          />
        </div>
        {/* <Input
          color="primary"
          className="w-3/4"
          type="email"
          variant="bordered"
          label="Nick Name"
        />
        <Input
          color="primary"
          className="w-3/4"
          type="email"
          variant="bordered"
          label="Last Name"
        /> */}
      </div>
    </>
  );
}
