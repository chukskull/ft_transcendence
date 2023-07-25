import React from "react";
import style from "../styles/Chat.module.scss";

interface ChannelsProps {
  name: string;
}

const Channels: React.FC<ChannelsProps> = ({ name }) => {
  return (
    <div className={style.channel}>
      <h4>{name}</h4>
    </div>
  );
};

export default Channels;
