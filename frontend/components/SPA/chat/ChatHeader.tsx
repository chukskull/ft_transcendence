"use client";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import style from "@/styles/SPA/chat/chat.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import UserMenu from "@/components/SPA/chat/UserMenu";
import ChannelMenu from "@/components/SPA/chat/channels/ChannelMenu";
import Modal from "react-modal";

interface chatHeaderProps {
  isChannel: boolean;
  dmOrChannel: any;
}

const ChatHeader = (chatHeaderProps: chatHeaderProps) => {
  const [showModal, setShow] = useState(false);
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
          <ChannelMenu channel={chatHeaderProps?.dmOrChannel} />
        ) : (
          <UserMenu user={chatHeaderProps?.dmOrChannel} />
        )}
      </Modal>
      <div className={style["chat-header"]}>
        <div className={style["chat-user-group"]}>
          {/* {!chatHeaderProps?.isChannel && (
            <AvatarBubble avatar="/assets/components/Profile.svg" online />
          )} */}
          <div className={style["name"]}>
            {chatHeaderProps?.dmOrChannel?.name}
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
          <FiLogOut className={style["leave-group"]} />
        )}
      </div>
    </>
  );
};

export default ChatHeader;
