import React, { useState, useEffect } from "react";
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
  getType: (type: boolean) => void;
  CompType: boolean;
}
const ChannelsSection = ({
  sendDmOrChannel,
  getType,
  CompType,
}: ChannelProps) => {
  const [addChModal, setAddChModal] = useState<boolean>(false);
  // const [channelList, setChannelList] = useState<Channel[]>([]);
  const [active, setActive] = useState<string>("");

  // useEffect(() => {
  //   axios.get("http://localhost:1337/api/channels").then((res) => {
  //     setChannelList(res.data);
  //   });
  // }, []);

  const channelCategoriesOrder = [
    {
      category: "public",
      property: "is_private",
      value: false,
      label: "Public Channels",
    },
    {
      category: "private",
      property: "is_private",
      value: true,
      label: "Private Channels",
    },
    {
      category: "protected",
      property: "is_protected",
      value: true,
      label: "Protected Channels",
    },
  ];

  const groupedChannels = m.reduce(
    (acc, channel) => {
      if (channel.is_private) {
        acc.private.push(channel);
      } else if (channel.is_protected) {
        acc.protected.push(channel);
      } else {
        acc.public.push(channel);
      }
      return acc;
    },
    { public: [], private: [], protected: [] } as Record<string, Channel[]>
  );

  function handleClick(channel: Channel) {
    sendDmOrChannel(channel);
    getType(true);
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
          {channelCategoriesOrder.map(({ category, label }) => (
            <div className="flex flex-col gap-1" key={category}>
              <h3>{label}</h3>
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
const m = [
  {
    id: 7,
    name: "global channel",
    is_private: false,
    is_protected: true,
    password: "$2b$10$EIgZTi.crlB5JPABNpVcrOurlfUqGE/T2kKNbvDIujENf576QcBE2",
  },
  {
    id: 8,
    name: "testtaazz",
    is_private: false,
    is_protected: false,
    password: "",
  },
  {
    id: 9,
    name: "حثيشلقهلثتقهلتثقتلثقلخقثل",
    is_private: true,
    is_protected: false,
    password: "",
  },
  {
    id: 10,
    name: "23r23rr",
    is_private: true,
    is_protected: false,
    password: "",
  },
  {
    id: 11,
    name: "fes69",
    is_private: false,
    is_protected: false,
    password: "",
  },
  {
    id: 17,
    name: "ownerhsip",
    is_private: false,
    is_protected: false,
    password: "",
  },
  {
    id: 18,
    name: "memberstest2",
    is_private: false,
    is_protected: false,
    password: "",
  },
  {
    id: 19,
    name: "testnagat",
    is_private: false,
    is_protected: false,
    password: "",
  },
  {
    id: 20,
    name: "yrethjerher",
    is_private: false,
    is_protected: false,
    password: "",
  },
];
