"use client";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import UserMenu from "@/components/SPA/chat/UserMenu";
import ChannelMenu from "@/components/SPA/chat/channels/ChannelMenu";
import Modal from "react-modal";
import axios from "axios";

interface chatHeaderProps {
  isChannel: boolean;
  dmOrChannel: any;
}

const ChatHeader = (chatHeaderProps: chatHeaderProps) => {
  const [showModal, setShow] = useState(false);
  const [user, setUser] = useState<any>(null);

  const leaveGroup = (id: number) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${id}/leave`, {
        withCredentials: true,
      })
      .then((res) => {
        document.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShow(false);
        }}
        className={
          chatHeaderProps?.isChannel
            ? style["channel-menu-modal"]
            : style["user-menu-modal"]
        }
        overlayClassName={style["modal-overlay"]}
      >
        {chatHeaderProps?.isChannel ? (
          <ChannelMenu
            channel={chatHeaderProps?.dmOrChannel}
            currentUser={user}
          />
        ) : (
          <UserMenu
            id={chatHeaderProps?.dmOrChannel?.members[0].id}
            avatarUrl={chatHeaderProps?.dmOrChannel?.members[0].avatarUrl}
            nickName={chatHeaderProps?.dmOrChannel?.members[0].nickName}
            online={chatHeaderProps?.dmOrChannel?.members[0].online}
            channel={false}
          />
        )}
      </Modal>
      <div className={style["chat-header"]}>
        <div className={style["chat-user-group"]}>
          <div className={style["name"]}>
            {chatHeaderProps?.isChannel
              ? chatHeaderProps?.dmOrChannel?.name
              : chatHeaderProps?.dmOrChannel.members[0].nickName}
          </div>
          <button
            onClick={() => {
              setShow(true);
            }}
          >
            <IoIosArrowDown
              width={12}
              height={8}
              className={style["arrow-down"]}
            />
          </button>
        </div>
        {chatHeaderProps?.isChannel && (
          <FiLogOut
            className={style["leave-group"]}
            onClick={() => {
              leaveGroup(chatHeaderProps?.dmOrChannel?.id);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChatHeader;
