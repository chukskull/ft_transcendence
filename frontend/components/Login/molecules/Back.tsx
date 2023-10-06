import React from "react";
import Image from "next/image";
export const Back = () => {
  return (
    <div>
      <div className="close">
        <div className="imageBall">
          <Image
            width={450}
            height={450}
            src="/assets/Login/ball.svg"
            alt="temp-logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Back;
