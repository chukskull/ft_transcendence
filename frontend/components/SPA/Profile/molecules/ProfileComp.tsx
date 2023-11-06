import { Avatar } from "@nextui-org/react";
import React from "react";
import Modal from "react-modal";
import UserMenu from "@/components/SPA/chat/UserMenu";
import style from "@/styles/SPA/chat/chat.module.scss";

interface ProfileCompProps {
  key?: number;
  img: string;
  nickName: string;
  firstName: string;
  lastName?: string;
}

const ProfileComp = ({
  key,
  img,
  nickName,
  firstName,
  lastName,
}: ProfileCompProps) => {
  const [showModal, setShow] = React.useState(false);
  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShow(false);
        }}
        overlayClassName={style["modal-overlay"]}
        className={style["user-menu-modal"]}
      >
        <UserMenu />
      </Modal>
      <div className="flex items-center  gap-5" onClick={() => setShow(true)}>
        <Avatar isBordered color="success" src={img} />
        <div className="m-0 p-0">
          <h4 className="text-white font-ClashGrotesk-Medium text-base m-0 p-0">
            {firstName} {lastName}
          </h4>
          <h6 className="text-white font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0">
            #{nickName}
          </h6>
        </div>
      </div>
    </>
  );
};

export default ProfileComp;
