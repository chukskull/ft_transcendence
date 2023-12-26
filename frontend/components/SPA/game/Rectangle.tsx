import React, { useEffect, useState } from "react";
import style from "@/styles/SPA/game/game.module.scss";
import Result from "@/components/SPA/game/Result";
import axios from "axios";

interface RectangleProps {
  display: boolean;
  leftScore: number;
  rightScore: number;
}

const Rectangle: React.FC<RectangleProps> = ({
  display,
  leftScore,
  rightScore,
}) => {
  const [value, setValue] = useState(0);
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setAvatar(res.data.avatarUrl);
        setName(`${res.data.firstName} ${res.data.lastName}`);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  if (!display) return null;
  return (
    <div className={style.centeredContent}>
      <div
        className={""}
        style={{
          opacity: 0.6,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          zIndex: 2,
        }}
      ></div>
      <div className="" style={{ position: "relative", zIndex: 2 }}>
        <Result
          name={name}
          img={avatar}
          scoreleft={leftScore}
          scoreright={rightScore}
          result={leftScore > rightScore ? "You Won" : "You Lost"}
          value={value}
        />
      </div>
    </div>
  );
};

export default Rectangle;
