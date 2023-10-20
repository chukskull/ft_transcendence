import React, { useState } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import { BiLock } from "react-icons/bi";
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

const FindFriendsModal = ({}) => {
  return (
    <>
      <h1>Select Friends</h1>
      <div className={style["input-group"]}>
        <div>
          <label>Username</label>
          <input type="text" id="username" placeholder="Username" />
        </div>
      </div>
      <button className={style["create-btn"]}>Create</button>
    </>
  );
};

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
    </>
  );
};

export default ChannelsSection;
