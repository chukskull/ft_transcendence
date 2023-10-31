import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import UserMenu from "@/components/SPA/chat/UserMenu";
import ChannelMenu from "@/components/SPA/chat/ChannelMenu";
import Modal from "react-modal";

interface chatHeaderProps {
  avatar: string;
  name: string;
  isChannel: boolean;
  online: boolean;
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
        {chatHeaderProps?.isChannel ? <ChannelMenu /> : <UserMenu />}
      </Modal>
      <div className={style["chat-header"]}>
        <div className={style["chat-user-group"]}>
          {!chatHeaderProps?.isChannel && (
            <AvatarBubble avatar="/assets/components/Profile.svg" online />
          )}
          <div className={style["name"]}>{chatHeaderProps.name}</div>
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
