"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface LogButtonProps {
  isGoogle?: boolean;
  image: string;
  text: string;
  altr: string;
  url: string;
}

export const LogButton = ({
  isGoogle,
  image,
  text,
  altr,
  url,
}: LogButtonProps) => {
  const router = useRouter();

  return (
    <>
      <Button
        className=" w-[90%] bg-inherit rounded-3xl border-2 px-16 py-2 text-center text-white text-base font-light
      animation duration-300 ease-in-out hover:scale-105"
        onClick={() => {
          router.push(url);
        }}
      >
        <Image
          className="mr-4"
          src={image}
          width={20}
          height={20}
          alt={altr}
        ></Image>
        {text}
      </Button>{" "}
    </>
  );
};

export default LogButton;
