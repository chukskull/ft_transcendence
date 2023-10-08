import React, { useState } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";

interface Channel {
  type: string;
  name: string;
}

const chanList = [
  {
    name: "#General",
    type: "public",
  },
  {
    name: "#Random",
    type: "public",
  },
  {
    name: "#Pedago",
    type: "public",
  },
  {
    name: "#WatchRoom",
    type: "private",
  },
  {
    name: "#GameRoom",
    type: "private",
  },
  {
    name: "#SecretRoom",
    type: "protected",
  },
];
const ChannelsSection = () => {
  const [addChModal, setAddChModal] = useState<boolean>(false);
  const channelList: Channel[] = chanList;
  const groupedChannels = channelList.reduce((acc, channel) => {
    if (!acc[channel.type]) {
      acc[channel.type] = [];
    }
    acc[channel.type].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "public":
        return "Public Channels";
      case "private":
        return "Private Channels";
      default:
        return "Protected Channels";
    }
  };

  return (
    <div className={style["channels"]}>
      <div className={style["section-header"]}>
        <h2>CHANNELS</h2>
        <button
          className={style["add-btn"]}
          onClick={() => setAddChModal(true)}
        >
          +
        </button>
      </div>
      <div className={style["channel-categories"]}>
        {Object.keys(groupedChannels).map((category) => (
          <div key={category}>
            <h3>{getCategoryTitle(category)}</h3>
            {groupedChannels[category].map((channel) => (
              <div className={style["channel-item"]} key={channel.name}>
                {channel.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelsSection;
