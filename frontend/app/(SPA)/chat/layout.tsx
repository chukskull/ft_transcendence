"use client";
import React, { useState, useEffect, ReactNode, use } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import ChannelsSection from "@/components/SPA/chat/channels/ChannelsSection";
import DmSection from "@/components/SPA/chat/DMSection";
import { useRouter } from "next/navigation";
import ChatHeader from "@/components/SPA/chat/ChatHeader";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [Type, setType] = useState(false);
  const [DmOrChannel, setDmOrChannel] = useState(null);

  const router = useRouter();

  if (Type && DmOrChannel !== null) {
    router.push(`/chat/channels/${DmOrChannel}`);
  } else {
    if (DmOrChannel !== null) router.push(`${"/chat/users/" + DmOrChannel}`);
  }


  return (
    <div className={style["chat-container"]}>
      <div className={style["menu-sections"]}>
        <ChannelsSection
          sendDmOrChannel={setDmOrChannel}
          getType={setType}
          CompType={Type}
        />
        <DmSection
          sendDmOrChannel={setDmOrChannel}
          getType={setType}
          CompType={Type}
        />
      </div>
      <div className={style["chat-section"]}>
        {DmOrChannel === null ? (
          <></>
        ) : (
          <ChatHeader isChannel={Type} dmOrChannel={DmOrChannel} />
        )}

        {children}
      </div>
    </div>
  );
}
