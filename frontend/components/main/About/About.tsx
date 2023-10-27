import React from "react";
import Image from "next/image";
const About = () => {
  return (
    <div className="mx-auto w-[1280px]">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-white font-ClashGrotesk-Semibold text-5xl">
            {" "}
            Our <span className="gamesvg">Vison: </span>
          </h1>
          <p className="text-white w-[60ch] mt-8 font-ClashGrotesk-Regular text-base opacity-80">
            Be ready for an electrifying high-pace ping-pong game, with varying
            difficulties and different environments! Compare the scores with
            players worldwide and compete for different rewards, using our
            pongPoints system which will help change the visuals on your paddle
            and on the ball after hitting it, and many other amazing things to
            come. Fasten your belts, Because it will be a crazy ride!
          </p>
        </div>
        <Image
          className="w-2/6 h-1/2"
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
