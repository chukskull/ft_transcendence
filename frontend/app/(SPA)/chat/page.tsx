"use client";
import style from "@/styles/SPA/chat/chat.module.scss";
import React from "react";
import "@/styles/globals.scss";
import { FiLogOut } from "react-icons/fi";
import { LiaTelegramPlane } from "react-icons/lia";
import { useState } from "react";
import ChannelsSection from "@/components/SPA/chat/ChannelsSection";
import ChatHeader from "@/components/SPA/chat/ChatHeader";
import DMbox from "@/components/SPA/chat/DMbox";
import MsgsList from "@/components/SPA/chat/MessagesList";



const dmList = [
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "02:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
];

const msgsdb = [
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are yerergkjprgopkrgopekr",
    lastMsgTime: "02:00 PM",
    avatar: "/assets/components/Profile.svg",
  },

  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are yerergkjprgopkrgopekr",
    lastMsgTime: "02:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are yerergkjprgopkrgopekr",
    lastMsgTime: "02:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
];



const DmSection = () => {
  return (
    <div className={style["direct-msgs"]}>
      <div className={style["section-header"]}>
        <h2>DIRECT MESSAGES</h2>
        <button className={style["add-btn"]}>+</button>
      </div>
      <div className={style["dm-list"]}>
        {dmList.map((dm) => (
          <DMbox dm={dm} key={dm.name} />
        ))}
      </div>
    </div>
  );
};

export default function Chat() {
  return (
    <>
      <div className={style["chat-container"]}>
        <div className={style["menu-sections"]}>
          <ChannelsSection />
          <DmSection />
        </div>
        <div className={style["chat-section"]}>
          <ChatHeader group={true} name="#lacastiekho" online avatar="" />
          <div className={style["chat"]}>
            <div className={style["msgs"]}>
              <MsgsList msgs={msgsdb} />
            </div>
            <div className={style["msg-input"]}>
              <input
                type="text"
                placeholder="Type your message here..."
                className={style["input"]}
              />
              <button className={style["send-btn"]}>
                <LiaTelegramPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
