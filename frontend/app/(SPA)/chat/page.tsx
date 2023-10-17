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
    name: "Saleh Nagat",
    online: true,
    lastMsg: "Hey, lets have sex for fun",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=2",
  },

  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "fine, thanks",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    name: "Saleh Nagat",
    online: false,
    lastMsg: "oh great happy to hear that",
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
    name: "Saleh Nagat",
    online: false,
    lastMsg: "Yes, its horrible i know the feeling",
    lastMsgTime: "11:00 AM",
    avatar: "https://i.pravatar.cc/300?img=1",
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
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
