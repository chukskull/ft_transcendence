import DMbox from "@/components/SPA/chat/DMbox";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import { useState } from "react";
import AvatarBubble from "./AvatarBubble";
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

const friendsList = [
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
  {
    nicknae: "John Doe",
    online: true,
    avatar: "/assets/components/Profile.svg",
  },
];

const FindFriendModal = () => {
  return (
    <>
      <h1>Select Friend</h1>
      <input type="text" id="username" placeholder="username of your friend" />
      <div className={style["friendsList"]}>
        {friendsList.map((friend) => (
          <div className={style["friend"]} key={friend.avatar}>
            <AvatarBubble
              avatar={friend.avatar}
              online={friend.online}
              key={friend.nicknae}
            />
            <h3>{friend.nicknae}</h3>
            
          </div>
        ))}
      </div>
    </>
  );
};

const DmSection = () => {
  const [findFriendModal, setFindFriendModal] = useState<boolean>(false);

  return (
    <>
      <Modal
        isOpen={findFriendModal}
        className={style["findFriendModal"]}
        overlayClassName={style["modal-overlay"]}
        onRequestClose={() => setFindFriendModal(false)}
      >
        <FindFriendModal />
      </Modal>
      <div className={style["direct-msgs"]}>
        <div className={style["section-header"]}>
          <h2>DIRECT MESSAGES</h2>
          <button
            className={style["add-btn"]}
            onClick={() => setFindFriendModal(true)}
          >
            +
          </button>
        </div>
        <div className={style["dm-list"]}>
          {dmList.map((dm) => (
            <DMbox dm={dm} key={dm.name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default DmSection;
