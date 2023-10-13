"use client";
import style from "@/styles/SPA/chat/chat.module.scss";
import "@/styles/globals.scss";
import { LiaTelegramPlane } from "react-icons/lia";
import ChannelsSection from "@/components/SPA/chat/ChannelsSection";
import ChatHeader from "@/components/SPA/chat/ChatHeader";
import MsgsList from "@/components/SPA/chat/MessagesList";
import DmSection from "@/components/SPA/chat/DMSection";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

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

export default function Chat() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (event: any, emojiObject: any) => {
    console.log(emojiObject);
    console.log(event);
    setMessage(message + emojiObject.emoji);
  };
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
              <button
                className={style["emoji-btn"]}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                👾
              </button>
              <input
                type="text"
                placeholder="Type your message here..."
                className={style["input"]}
                value={message.toString()}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className={style["send-btn"]}>
                <LiaTelegramPlane />
              </button>
            </div>
            {showEmojiPicker && (
              <div className={style["emoji-picker"]}>
                <EmojiPicker onEmojiClick={handleEmojiClick}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
