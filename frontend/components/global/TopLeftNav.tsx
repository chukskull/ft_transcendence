"use client";
import style from "@/styles/components/TopLeftNav.module.scss";
import "@/styles/globals.scss";
import Image from "next/image";
import { BsBell } from "react-icons/bs";
import { Badge, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import GlobalModalComp from "./GlobalModalComp";
import { useState } from "react";
import Link from "next/link";
import ProfileSettingModal from "./ProfileSettingModal";
import SearchComp from "./SearchComp";
import { NotificationIcon } from "./NotificationIcon";
import { notification } from "antd";
import { NotificationComp } from "./NotificationComp";

export default function TopLeftNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [string, setString] = useState<string>("");

  const handleClick = (comp: string) => {
    onOpen();
    setString(comp);
  };
  const notificationClicked = () => {};
  return (
    <>
      <div className={style["top-bar"]}>
        <div className={style["top_logo"]}>
          <Link href="/home">
            <Image
              src="/assets/main/Navbar/Vector.svg"
              alt="logo"
              width={45}
              height={45}
            />
          </Link>
        </div>
        <SearchComp />
        <div className={`${style["top_notif"]} + cursor-pointer`}>
          <NotificationComp />
        </div>
      </div>
      <div className={style["left-bar"]}>
        <div className={style["left_menu"]}>
          <Link href="/chat">
            <img src="/assets/main/Navbar/chat.svg" />
          </Link>
          <Link href="/game">
            <img src="/assets/main/Navbar/Game.svg" />
          </Link>
          <Link href="/profile">
            <img src="/assets/main/Navbar/Profile.svg" />
          </Link>
          <Link href="/shop">
            <img src="/assets/main/Navbar/Shop.svg" />
          </Link>
        </div>
        <div className={style["left_bottom_menu"]}>
          <img
            src="/assets/main/Navbar/Setting.svg"
            onClick={() => handleClick("setting")}
          />
          <img
            src="/assets/main/Navbar/Logout.svg"
            onClick={() => handleClick("Logout")}
          />
        </div>
      </div>
      <Modal hideCloseButton={true} isOpen={isOpen} onClose={onClose}>
        <ModalContent className="flex flex-col items-center justify-center bg-modalBackground w-full  p-12 rounded-[4rem]">
          {string === "setting" ? (
            <ProfileSettingModal onClose={onClose} />
          ) : (
            <GlobalModalComp onClose={onClose} action={string} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
