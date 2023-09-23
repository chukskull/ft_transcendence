"use client";
import NavBar from "../../../components/Navbar";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Login() {
  return (
    <main className="h-full w-full">
      <NavBar boolBut={false} />
      <div className="close">
        <div className="imageBall">
          <img src="/assets/Login/ball.svg" alt="temp-logo" />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="rectangle flex flex-col items-center">
          <h1 className="text-red-800 text-lg"> Ur mum wlah</h1>
          <Button radius="full" className="bg-red-800 shadow-lg">
            Button am here
          </Button>
        </div>
      </div>
    </main>
  );
}
