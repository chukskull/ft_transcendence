"use client";
import React, { useState, useEffect, ReactNode, use } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import ChannelsSection from "@/components/SPA/chat/channels/ChannelsSection";

import DmSection from "@/components/SPA/chat/DMSection";
import { useRouter } from "next/navigation";
import ChatHeader from "@/components/SPA/chat/ChatHeader";
// import io from "socket.io-client";

const msgsdb = [
  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "Hi how are you",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=2",
  },

  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "i love you, thanks",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    name: "Saleh Nagat",
    online: false,
    lastMsg: "oh idont",
    lastMsgTime: "11:00 AM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "i hate 9/11 its just a sad story",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    name: "le_mountassir",
    online: false,
    lastMsg: "KYS",
    lastMsgTime: "11:00 AM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
];

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [conversationId, setConversationId] = useState("");
  const router = useRouter();
  const [name, setName] = useState("");
  const [Type, setType] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const getNameAndType = (OBJ: {
    name: string;
    type: boolean;
    id?: number | null;
  }) => {
    setType(OBJ.type);
    setName(OBJ.name);
    if (OBJ.id) setId(OBJ.id);

    if (OBJ.type) {
      router.push(`${"/chat/channels/" + OBJ.id}`);
    } else router.push(`${"/chat/users/" + OBJ.name}`);
  };
  return (
    <div className={style["chat-container"]}>
      <div className={style["menu-sections"]}>
        <ChannelsSection getNameAndType={getNameAndType} CompType={Type} />
        <DmSection
          SendconversationId2p={setConversationId}
          getNameAndType={getNameAndType}
          CompType={Type}
        />
      </div>
      <div className={style["chat-section"]}>
        {name === "" && !id ? (
          <></>
        ) : (
          <ChatHeader isChannel={Type} name={name} online />
        )}

        {children}
      </div>
    </div>
  );
}
