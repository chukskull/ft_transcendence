import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import { FaUser, FaUserPlus, FaUserSlash } from "react-icons/fa";
import { BsController, BsChatLeftText } from "react-icons/bs";
import Modal from "react-modal";
interface chatHeaderProps {
  avatar: string;
  name: string;
  group: boolean;
  online: boolean;
}

const UserMenu = () => {
  return (
    <>
      <div className={style["user-info"]}>
        <AvatarBubble avatar="/assets/components/Profile.svg" online />
        <h2>John Doe</h2>
      </div>
      <div className={style["line"]} />
      <div className={style["menu"]}>
        <div className={style["menu-item"]}>
          <FaUser />
          View Profile
        </div>
        <div className={style["menu-item"]}>
          <BsController />
          Invite To A Game
        </div>
        <div className={style["menu-item"]}>
          <BsChatLeftText />
          Message
        </div>
        <div className={style["menu-item"]}>
          <FaUserPlus />
          Add Friend
        </div>
        <div className={style["menu-item"]}>
          <FaUserSlash />
          Block
        </div>
      </div>
    </>
  );
};

const ChatHeader = (chatHeaderProps: chatHeaderProps) => {
  const [showModal, setShow] = useState(false);
  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShow(false);
        }}
        className={style["user-menu-modal"]}
        overlayClassName={style["modal-overlay"]}
      >
        <UserMenu />
      </Modal>
      <div className={style["chat-header"]}>
        <div className={style["chat-user-group"]}>
          {!chatHeaderProps.group && (
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
        {chatHeaderProps.group && <FiLogOut className={style["leave-group"]} />}
      </div>
    </>
  );
};

export default ChatHeader;
