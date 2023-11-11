import React, { useState,useEffect } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import CreateChannelModal from "./CreateChannel";
import axios from "axios";

interface Channel {
  type: string;
  name: string;
  id: number;
  is_private: boolean;
  is_protected: boolean;
}



interface ChannelProps {
  sendDmOrChannel: (channel: any) => void;
  getType: (type: boolean ) => void;
  CompType: boolean;
}
const ChannelsSection = ({
  sendDmOrChannel,
  getType,
  CompType,
}: ChannelProps) => {
  const [addChModal, setAddChModal] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:1337/api/channels").then((res) => {
      console.log(res);
      setChannelList(res.data);
    });
  }
  , []);
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
  function handleClick(channel: Channel) {
    sendDmOrChannel(channel);
    getType(true );
    setActive(channel.name);
  }
  return (
    <>
      <Modal
        isOpen={addChModal}
        className={style["addChanModal"]}
        overlayClassName={style["modal-overlay"]}
        onRequestClose={() => setAddChModal(false)}
      >
        <CreateChannelModal />
      </Modal>
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
            <div className="flex flex-col gap-1" key={category}>
              <h3>{getCategoryTitle(category)}</h3>
              {groupedChannels[category].map((channel) => (
                <div
                  className={`${style["channel-item"]} ${
                    active === channel.name && CompType
                      ? "bg-bghover rounded-md"
                      : ""
                  }`}
                  key={channel.name}
                  onClick={() => handleClick(channel)}
                >
                  {channel.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChannelsSection;
