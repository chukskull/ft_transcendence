"use client";

import "@/styles/globals.scss";
import Image from "next/image";
import { Button, NextUIProvider } from "@nextui-org/react";
import LogButton from "@/components/Login/atoms/LogButton";

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rectangle flex flex-col items-center justify-center gap-14">
        <h1 className=" h-7 text-fontlight text-center font-semibold text-4xl">
          {" "}
          Sign In
        </h1>
        <div className="flex flex-col items-center justify-center gap-7">
          {LogButtos.map((button, index) => (
            <LogButton
              key={index}
              isGoogle={button.isGoogle}
              image={button.image}
              text={button.text}
              altr={button.altr}
              url={button.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const LogButtos = [
  {
    isGoogle: true,
    image: "/assets/Login/google.svg",
    text: "Sign in with Google",
    altr: "google",
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
  },
  {
    isGoogle: false,
    image: "/assets/Login/intra.svg",
    text: "Sign in with Intranet",
    altr: "intra",
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/42`,
  },
];
