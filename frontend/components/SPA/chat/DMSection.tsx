"use client";
import DMbox from "@/components/SPA/chat/DMbox";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import AvatarBubble from "./AvatarBubble";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "react-query";

interface FindFriendModalProps {
  whenFriendModal: (type: boolean) => void;
}

const FindFriendModal = ({ whenFriendModal }: FindFriendModalProps) => {
  const router = useRouter();
  const [friendsList, setFriendsList] = useState<any>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
        withCredentials: true,
      })
      .then((res) => {
        setFriendsList(res.data.friends);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>Select Friend</h1>
      <input type="text" id="username" placeholder="username of your friend" />
      <div className={style["friendsList"]}>
        {friendsList?.map((friend: any) => (
          <div
            className={style["friend"]}
            key={friend.id}
            onClick={() => {
              router.push(`/chat/users/${friend.nickName}`);
              whenFriendModal(false);
            }}
          >
            <AvatarBubble avatar={friend.avatarUrl} online={friend.online} />
            <h3>{friend.nickName}</h3>
          </div>
        ))}
      </div>
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
    const selectedUser = dmsList.find(
      (dm: any) => dm.members[0].nickName === nickName
    );
    if (selectedUser) {
      sendDmOrChannel(selectedUser);
      getType(false);
      setActive(selectedUser.nickName);
    }
  }, [dmsList, params, sendDmOrChannel, getType]);

  const { data: dmsListData, isLoading } = useQuery(
    "conversations",
    async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    }
  );

  useEffect(() => {
    if (dmsList) {
      setDmsList([]);
    }
    if (dmsListData) {
      setDmsList(dmsListData);
    }
  }, [dmsListData, dmsList]);
  return (
    <>
      <Modal
        isOpen={findFriendModal}
        className={style["findFriendModal"]}
        overlayClassName={style["modal-overlay"]}
        onRequestClose={() => setFindFriendModal(false)}
      >
        <FindFriendModal whenFriendModal={setFindFriendModal} />
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
                active === dm.members[0].nickName && !CompType
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
