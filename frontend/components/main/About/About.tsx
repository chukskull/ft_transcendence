import React from "react";
import Image from "next/image";
const About = () => {
  return (
    <div className="mx-auto w-[1280px]">
      <div className="flex  items-center justify-evenly">
        <Image
          className="w-1/2"
          src="/assets/main/Hero/kys2.png"
          alt="temp-logo"
          width={550}
          height={550}
        />

        <div>
          <h1 className="text-white"> Our Vison: </h1>
          <p className="text-white w-[70ch] mt-8">
            Be ready for an electrifying high-pace ping-pong game, with varying
            difficulties and different environments! Compare the scores with
            players worldwide and compete for different rewards, using our
            pongPoints system which will help change the visuals on your paddle
            and on the ball after hitting it, and many other amazing things to
            come. Fasten your belts, Because it will be a crazy ride!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
