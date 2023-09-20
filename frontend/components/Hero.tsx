import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";


export const Hero = () => {
  return (
    <>
      <div className="backrnd-img relative p-0 m-0">
        <Image
          width={1300}
          height={796.884}
          className="-z-[-10]"
          src={"/assets/fontshapes.svg"}
          alt={"background shapes"}
        />
        <div className=" flex flex-col gap-y-12 text-bc bg-none absolute top-[0%] xl:right-[50%] 2xl:right-[50%] my-[11.25rem]  p-[1.25rem]">
          <h1 className="bg-none text-white my-2 w-[604px] font-[Josefin Sans] text-8xl font-style-normal font-medium">
            BEST <span className="gamesvg">GAME !</span>
              <br></br>
              ON DEMAND
          </h1>
          <p className="bg-none leading-[22.55px] text-white w-[576px] font-[ClashGrotesk] text-lg font-medium">
            {" "}
            Step into the fast-paced and addictive world of ping pong Game! Get
            ready to experience the thrill of virtual table tennis from the
            comfort of your own device.
          </p>
          <Button
            className=" w-[165px] h-[45px] gradient-button 
          via-transparent via-transparent text-white shadow-lg rounded-2xl"
          >
            Join Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Hero;
