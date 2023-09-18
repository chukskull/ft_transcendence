import React from "react";
import Image from "next/image";

export const Hero = () => {
  return (
    <>
      <div className="backrnd-img relative">
        <Image
          width={1411}
          height={1069}
          className="z-[-10]"
          src={"/assets/frontshapes.png"}
          alt={"background shapes"}
        />
        <div className="text-bc bg-none absolute top-[0%] xl:right-[52%] 2xl:right-[52%] my-[11.25rem] m-auto">
          <h1 className="bg-none text-white my-2 w-[604px] font-[ClashGrotesk] text-8xl font-style-normal font-weight-600 p-[1.25rem]">
            BEST ON DEMAND!
          </h1>
        </div>
      </div>
    </>
  );
};

export default Hero;
