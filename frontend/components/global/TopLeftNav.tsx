"use client";
import style from "@/styles/components/TopLeftNav.module.scss";

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
import axios from "axios";

export default function TopLeftNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [string, setString] = useState<string>("");

  const handleClick = (comp: string) => {
    onOpen();
    setString(comp);
  };
  const [badge, setBadge] = useState(false);
  const handleBadge = () => {
    setBadge(true);
  };
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
          <NotificationComp count={5} />
        </div>
      </div>
      <div className={style["left-bar"]}>
        <div className={style["left_menu"]}>
          <Link href="/chat">
            <Badge
              isInvisible={badge}
              isOneChar
              shape="circle"
              color="danger"
              content={<NotificationIcon size={1} />}
            >
              <img src="/assets/main/Navbar/chat.svg" onClick={handleBadge} />
            </Badge>
          </Link>
          <Link href="/game">
            <img src="/assets/main/Navbar/Game.svg" />
          </Link>
          <Link href="/profile">
            <img src="/assets/main/Navbar/Profile.svg" />
          </Link>
        </div>
        <div className={style["left_bottom_menu"]}>
          <img
            src="/assets/main/Navbar/Setting.svg"
            onClick={() => handleClick("setting")}
          />
          <img
            src="/assets/main/Navbar/Logout.svg"
            onClick={() => {
              axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
                  withCredentials: true,
                })
                .then((res) => {
                  window.location.href = "/";
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
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
