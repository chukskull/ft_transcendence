"use client";
import "@/styles/globals.css";
import { Button, NextUIProvider } from "@nextui-org/react";

export default function Login() {
  return (
    <NextUIProvider>
      <main className="h-screen">
        <div className="close">
          <div className="imageBall">
            <img src="/assets/Login/ball.svg" alt="temp-logo" />
          </div>
        </div>
        <div className="h-full w-full flex items-center justify-center">
          <div className="rectangle flex flex-col items-center justify">
            <Button radius="full" className="bg-red-200 shadow-lg">
              Button am here
            </Button>
          </div>
        </div>
      </main>
    </NextUIProvider>
  );
}
