"use client";
import React, { useState, useEffect } from "react";
import { LiaTelegramPlane } from "react-icons/lia";
import EmojiPicker from "emoji-picker-react";
import style from "@/styles/SPA/chat/chat.module.scss";
import io from "socket.io-client";
import MsgsList from "@/components/SPA/chat/MessagesList";
import axios from "axios";
interface ChatRoomsProps {
  id: String | String[];
  isGroup: boolean;
}
interface Chat {
  id: number;
  sender: any;
  messahe: string;
  timestamp: Date;
}

export default function ChatRooms({ id, isGroup }: ChatRoomsProps) {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msgs, setMsgs] = useState<Chat[]>([]);

  useEffect(() => {
    const endPoints = isGroup
      ? `/api/channels/${id}/chat`
      : `/api/users/friends/${id}/chat`;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endPoints}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMsgs(res.data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chatSocket`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect_error", (error: any) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason: any) => {
      console.warn("WebSocket disconnected:", reason);
    });

    socket.on("newMessage", (newMessage: any) => {
      console.log("newMessage : " + newMessage);
      setMsgs((prevMsgs: Chat[]) => [...prevMsgs, newMessage]);
    });

    return () => {
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("newMessage");
    };
  }, [socket]);

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSend = () => {
    if (socket) {
      socket.emit("messageSent", {
        conversationId: 432423,
        sender: 2,
        message: message,
      });

      setMessage("");
    } else {
      console.error("WebSocket is not connected. Message not sent.");
    }
  };
  return (
    <div className={style["chat"]}>
      <div className={style["msgs"]}>
        <MsgsList msgs={msgs} />
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
