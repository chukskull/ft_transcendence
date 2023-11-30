import { useEffect, useRef, useState } from "react";
import AvatarBubble from "./AvatarBubble";
import style from "@/styles/SPA/chat/chat.module.scss";
import Modal from "react-modal";
import UserMenu from "./UserMenu";

const MsgsList = ({ chats }: { chats: any }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showModal, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({
    id: 0,
    nickName: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);
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
        <UserMenu
          id={userInfo.id}
          nickName={userInfo.nickName}
          avatarUrl={userInfo.avatarUrl}
          channel={false}
        />
      </Modal>
      <div className={style["msgs-list"]}>
        {chats?.map(
          (msg: any) =>
            msg?.message?.length > 0 && (
              <div className={style["msg-item"]} key={msg?.id}>
                <div
                  onClick={() => {
                    setUserInfo({
                      id: msg.sender?.id,
                      nickName: msg.sender?.nickName,
                      avatarUrl: msg.sender?.avatarUrl,
                    });
                    setShow(true);
                  }}
                >
                  <AvatarBubble
                    avatar={msg.sender?.avatarUrl}
                    online={msg.sender?.status}
                    key={msg?.id}
                  />
                </div>
                <div className={style["msg-info"]} key={msg?.id}>
                  <div className={style["username"]}>
                    {msg.sender?.nickName}
                  </div>
                  <div className={style["msg-content"]}>{msg?.message}</div>
                </div>
                <div className={style["msg-time"]}>
                  {msg?.time.split("T")[0]+ " "}
                  {msg?.time.split("T")[1].split(".")[0]}
                </div>
              </div>
            )
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default MsgsList;
