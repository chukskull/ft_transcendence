"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import style from "@/styles/SPA/chat/chat.module.scss";
import ChannelsSection from "@/components/SPA/chat/channels/ChannelsSection";
import DmSection from "@/components/SPA/chat/DMSection";
import ChatHeader from "@/components/SPA/chat/ChatHeader";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [Type, setType] = useState(false);
  const [DmOrChannel, setDmOrChannel] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    if (Type && DmOrChannel) {
      router.push(`/chat/channels/${DmOrChannel?.id}`);
    } else if (DmOrChannel) {
      router.push(`/chat/users/${DmOrChannel?.members[0]?.nickName}`);
    }
  }, [Type, DmOrChannel, router]);

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
        {DmOrChannel && (
          <ChatHeader isChannel={Type} dmOrChannel={DmOrChannel} />
        )}
        {children}
      </div>
    </div>
  );
}
