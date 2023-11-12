"use client";
import React, { useState, useEffect, ReactNode, use } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import ChannelsSection from "@/components/SPA/chat/channels/ChannelsSection";
import DmSection from "@/components/SPA/chat/DMSection";
import { useRouter } from "next/navigation";
import ChatHeader from "@/components/SPA/chat/ChatHeader";
// import io from "socket.io-client";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [Type, setType] = useState(false);
  const [DmOrChannel, setDmOrChannel] = useState(null);
  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // const socket = io("http://localhost:1337");

  useEffect(() => {
    // socket.on("open", () => {
    //   console.log("WebSocket connected");
    // });
    // socket.on("message", (event) => {
    //   console.log("WebSocket message:", event);
    // });
    // return () => {
    //   socket.close(); // Close the WebSocket when the component unmounts
    // };
  }, []);

  const handleSend = () => {
    // if (socket) {
    //   socket.emit("message", {
    //     conversationId,
    //     senderId: "1",
    //     message,
    //   });
    setMessage("");
  };
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
