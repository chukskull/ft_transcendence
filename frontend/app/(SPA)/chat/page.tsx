"use client";
import React, { useState, useEffect } from "react";
import { LiaTelegramPlane } from "react-icons/lia";
import EmojiPicker from "emoji-picker-react";
import style from "@/styles/SPA/chat/chat.module.scss";
import "@/styles/globals.scss";
import ChannelsSection from "@/components/SPA/chat/ChannelsSection";
import ChatHeader from "@/components/SPA/chat/ChatHeader";
import MsgsList from "@/components/SPA/chat/MessagesList";
import DmSection from "@/components/SPA/chat/DMSection";
// import io from "socket.io-client";
import { set } from "react-hook-form";

const msgsdb = [
  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "egwegewewg",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=2",
  },

  {
    name: "Saleh Nagat",
    online: true,
    lastMsg: "fineewgewgewgw, thanks",
    lastMsgTime: "02:00 PM",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    name: "Saleh Nagat",
    online: false,
    lastMsg: "oh greewgegwegwegweg",
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

export default function Chat() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationId, setConversationId] = useState("");

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
  // };
  const [Name, setName] = useState(msgsdb[0].name);
  const [Type, setType] = useState(false);
  const getNameAndType = (OBJ: { name: string; type: boolean }) => {
    setName(OBJ.name);
    setType(OBJ.type);
  };
  return (
    <div className={style["chat-container"]}>
      <div className={style["menu-sections"]}>
        <ChannelsSection
          sendConversationId={setConversationId}
          getNameAndType={getNameAndType}
        />
        <DmSection
          SendconversationId2p={setConversationId}
          getNameAndType={getNameAndType}
        />
      </div>
      <div className={style["chat-section"]}>
        <ChatHeader
          // avatar="https://i.pravatar.cc/300?img=4"
          name={Name}
          isChannel={Type}
          online={true}
        />

        <div className={style["chat"]}>
          <div className={style["msgs"]}>
            <MsgsList msgs={msgsdb} getNameAndType={getNameAndType} />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button className={style["send-btn"]} onClick={handleSend}>
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
  );
}
