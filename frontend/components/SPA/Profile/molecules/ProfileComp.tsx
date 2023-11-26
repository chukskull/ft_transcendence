import { Avatar } from "@nextui-org/react";
import React from "react";
import Modal from "react-modal";
import UserMenu from "@/components/SPA/chat/UserMenu";
import style from "@/styles/SPA/chat/chat.module.scss";
import { ProtectedModal } from "@/components/global/ChannelPass";
import axios from "axios";

interface ProfileCompProps {
  id?: number;
  img: string;
  nickName?: string;
  firstName: string;
  lastName?: string;
  color?: string;
  type?: "Protected" | "Public" | "achiv" | null;
  inChannel?: boolean;
  channelId?: number;
}

const ProfileComp = ({
  id,
  img,
  nickName,
  firstName,
  lastName,
  type,
  color,
  inChannel,
  channelId,
}: ProfileCompProps) => {
  const [showModal, setShow] = React.useState(false);

  const handleModalClick = () => {
    if (type === "Protected") {
      setShow(true);
    } else if (type === "Public") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channelId}/join`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
    else if (type === "achiv") {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  return (
    <div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShow(false)}
        overlayClassName={style["modal-overlay"]}
        className={style["user-menu-modal"]}
      >
        {showModal &&
          (type === "Protected" ? (
            <ProtectedModal channelId={channelId} />
          ) : (
            <UserMenu
              id={id}
              channel={inChannel}
              avatarUrl={img}
              nickName={nickName}
            />
          ))}
      </Modal>


      <div className="flex items-start justify-start gap-5" onClick={handleModalClick}>

        <Avatar isBordered color="success" src={img} />
        <div className="m-0 p-0">
          <h4 className="text-white font-ClashGrotesk-Medium text-base m-0 p-0 ">
            {firstName} {lastName}
          </h4>
          <h6 className="text-white font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0">
            {nickName ? "#" : ""}
            {nickName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
