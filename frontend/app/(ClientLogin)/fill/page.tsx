"use client";

import { Button, Input } from "@nextui-org/react";
import React from "react";
import "@/styles/globals.scss";


const styles = {
  label: "text-gray-400 dark:text-white/90 font-bold text-sm mb-2 pl-2",
  input: [
    "bg-transparent",
    "text-white dark:text-white/90",
    "placeholder:text-white dark:placeholder:text-white/60",
    "placeholder-opacity-60",
    "pl-2",
    "font-bold",
  ],
  innerWrapper: "bg-transparent ",
  inputWrapper: [
    "w-80",
    "h-[48px]",
    "rounded-3xl",
    "border-0",
    "shadow-xl",
    "bg-transparent",
    "hover-within:text-black/80",
    "backdrop-blur-xl",
    "backdrop-saturate-200",
    "!cursor-text",
  ],
};


export default function Fill() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rectangle flex  items-center justify-center">
          <div className="w-80 flex flex-col items-center justify-center gap-12">

          <Input
          type="name"
          label="Name"
            isClearable
            variant="bordered"
            classNames={{
             ...styles,
            }}
          />
          <Input
          type="lastname"
          label="Last Name"
            isClearable
            variant="bordered"
            classNames={{
             ...styles,
            }}
          />
          <Input
          type="nickname"
          label="Nickname"
            isClearable
            variant="bordered"
            classNames={{
             ...styles,
            }}
          />
           <Button
            
            className="mt-2 w-[140px] h-[40px] gradient-button 
           text-white shadow-lg rounded-3xl"
          >
             Play
          </Button>
          </div>
        </div>
      </div>
    </>
  );
}
