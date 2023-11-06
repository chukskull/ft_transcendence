"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };

  return (
    <>
      <div className="backrnd-img relative p-0 m-0">
        <Image
          width={1300}
          height={796.884}
          className="-z-[-10]"
          src={"/assets/main/Hero/fontshapes.svg"}
          alt={"background shapes"}
        />
        <div className=" flex flex-col gap-y-12 text-bc bg-none absolute top-[0%] xl:right-[50%] 2xl:right-[50%] xl:my-[11.25rem] my-[8.25rem] p-[1.25rem]">
          <h1 className="bg-none text-white my-2  font-[Josefin Sans] text-5xl md:text-7xl lg:text-8xl font-style-normal font-medium">
            BEST <span className="gamesvg bg-none">GAME !</span>
            <br></br>
            ON DEMAND
          </h1>
          <p className="paragraph">
            {" "}
            Step into the fast-paced and addictive world of ping pong Game! Get
            ready to experience the thrill of virtual table tennis from the
            comfort of your own device.
          </p>
          <Button
            onClick={handleClick}
            className=" w-[165px] h-[45px] gradient-button 
           text-white shadow-lg rounded-2xl"
          >
            Join Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Hero;
