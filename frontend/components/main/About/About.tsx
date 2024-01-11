import React from "react";
import Image from "next/image";
const About = () => {
  return (
    <div className="mx-auto  p-[1.25rem]">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-fontlight font-ClashGrotesk-Semibold text-5xl">
            {" "}
            How To <span className="gamesvg">Play: </span>
          </h1>
          <p className="text-fontlight w-[60ch] max-sm:w-[100%] mt-8 font-ClashGrotesk-Regular text-base opacity-80">
            The movement is done by pressing the arrow keys on the keyboard, up
            and down arrow keys. Race to the finish! Be the first to blast
            through 5 points and claim victory! The player who reaches 5 points
            first wins. Don&apos;t chicken out! Leaving early means instant
            defeat! Good Luck and have fun!
          </p>
        </div>
        <Image
          className="w-2/6 h-1/2 max-sm:hidden max-md:hidden"
          src="/assets/main/Hero/kys2.png"
          alt="temp-logo"
          width={350}
          height={350}
        />
      </div>
    </div>
  );
};

export default About;
