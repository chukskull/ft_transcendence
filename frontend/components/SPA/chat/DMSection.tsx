import DMbox from "@/components/SPA/chat/DMbox";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import AvatarBubble from "./AvatarBubble";
import { useParams } from "next/navigation";
import axios from "axios";

const FindFriendModal = () => {
  return (
    <>
      {/* <h1>Select Friend</h1>
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
      </div> */}
    </>
  );
};

interface DmSectionProps {
  getType: (type: boolean) => void;
  sendDmOrChannel: (dm: any) => void;
  CompType: boolean;
}
const DmSection = ({ getType, sendDmOrChannel, CompType }: DmSectionProps) => {
  const [findFriendModal, setFindFriendModal] = useState<boolean>(false);
  const [active, setActive] = useState<string>("");
  const [dmsList, setDmsList] = useState<any>([]);
  const params = useParams();
  const handleConversationId = (dm: any) => {
    getType(false);
    sendDmOrChannel(dm);
    setActive(dm.members[0].nickName);
  };
  useEffect(() => {
    const nickName = params.id;
    const selectedUser = dmsList.find((dm: any) => dm.id === nickName);
    if (selectedUser) {
      sendDmOrChannel(selectedUser);
      getType(false);
      setActive(selectedUser.name);
    }
  }, [dmsList, params.id, sendDmOrChannel, getType]);

  useEffect(() => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations`, {
          withCredentials: true,
        })
        .then((res) => {
          setDmsList(res.data);
          console.log(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);
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
        {dmsList.map((dm: any) => (
          <div
            key={dm.id}
            className={style["dm-list"]}
            onClick={() => handleConversationId(dm)}
          >
            <DMbox
              className={
                (active === dm.members[0].nickName && !CompType)
                  ? "bg-gray-500 rounded-md"
                  : "bg-bghover rounded-md"
              }
              dm={dm}
              badge={0}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default DmSection;
