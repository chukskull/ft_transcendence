import { Avatar } from "@nextui-org/react";
import React from "react";
import Modal from "react-modal";
import UserMenu from "@/components/SPA/chat/UserMenu";
import style from "@/styles/SPA/chat/chat.module.scss";
import { ProtectedModal } from "@/components/global/ChannelPass";
import axios from "axios";

interface ProfileCompProps {
  key?: number;
  img: string;
  nickName: string;
  firstName: string;
  lastName?: string;
  color?: string;
  type?: "Private" | "Public" | null;
}

const ProfileComp = ({
  key,
  img,
  nickName,
  firstName,
  lastName,
  type,
  color,
}: ProfileCompProps) => {
  const [showModal, setShow] = React.useState(false);

  const handleModalClick = () => {
    if (type === "Private") {
      setShow(true);
    } else if (type === "Public") {
      axios.post("/api/auth/join");
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
          (type === "Private" ? (
            <ProtectedModal /> // Show protected modal for private channels
          ) : (
            <UserMenu /> // Show standard user menu for other channel types
          ))}
      </Modal>
      <div className="flex items-center  gap-5" onClick={handleModalClick}>
        <Avatar isBordered color="success" src={img} />
        {/* {color ? (
          <svg
            className="absolute z-12 top-[-16%] right-[68%] w-12"
            id="crown"
            fill={color}
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 50"
          >
            <polygon
              className="cls-1"
              points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
            />
          </svg>
        ) : (
          <span> </span>
        )} */}
        <div className="m-0 p-0">
          <h4 className="text-white font-ClashGrotesk-Medium text-base m-0 p-0">
            {firstName} {lastName}
          </h4>
          <h6 className="text-white font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0">
            #{nickName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
