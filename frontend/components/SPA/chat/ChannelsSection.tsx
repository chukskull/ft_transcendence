import React, { useState } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import { BiLock } from "react-icons/bi";
import { get } from "http";
import { act } from "react-dom/test-utils";

interface Channel {
  id: number;
  type: string;
  name: string;
}

const chanList = [
  {
    id: 1,
    name: "General",
    type: "public",
  },
  {
    id: 2,
    name: "Random",
    type: "public",
  },
  {
    id: 3,
    name: "Pedago",
    type: "public",
  },
  {
    id: 4,
    name: "WatchRoom",
    type: "private",
  },
  {
    id: 5,
    name: "GameRoom",
    type: "private",
  },
  {
    id: 6,
    name: "SecretRoom",
    type: "protected",
  },
];

const CreateChannelModal = ({}) => {
  return (
    <>
      <h1>Create Channel</h1>
      <div className={style["input-group"]}>
        <div>
          <label>Channel Name</label>
          <input type="text" id="channel-name" placeholder="#NewChannel" />
        </div>
        <div>
          <label>Channel Password (Optional)</label>
          <input
            type="password"
            id="channel-paswd"
            name="channel-paswd"
            placeholder="Set Password"
          />
        </div>
        <div className={style["prv-btn"]}>
          <h3>
            <BiLock />
            Private Channel
          </h3>
          <input type="checkbox" />
        </div>
      </div>
      <button className={style["create-btn"]}>Create</button>
    </>
  );
};
interface ChannelProps {
  // sendConversationId: (id: string) => void;
  getNameAndType: (Channel: {
    name: string;
    type: boolean;
    id: number;
  }) => void;
  CompType: boolean;
}
const ChannelsSection = ({
  // sendConversationId,
  getNameAndType,
  CompType,
}: ChannelProps) => {
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
  const [active, setActive] = useState<string>("");
  function handleClick(channel: Channel) {
    // sendConversationId(channel.name);
    getNameAndType({ name: channel.name, type: true, id: channel.id });
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
                  {"#"}
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
