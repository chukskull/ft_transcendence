"use client";
import React, { useState, useEffect } from "react";
import { LiaTelegramPlane } from "react-icons/lia";
import EmojiPicker from "emoji-picker-react";
import style from "@/styles/SPA/chat/chat.module.scss";

import MsgsList from "@/components/SPA/chat/MessagesList";

// import io from "socket.io-client";

interface ChatRoomsProps {
  id: String | String[];
}
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

export default function ChatRooms({ id }: ChatRoomsProps) {
  console.log(id, "kys");
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  return (
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
  );
}
