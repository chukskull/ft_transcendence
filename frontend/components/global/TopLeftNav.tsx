"use client";
import style from "@/styles/components/TopLeftNav.module.scss";
import "@/styles/globals.scss";
import Image from "next/image";
import {
  BsChatLeftText,
  BsController,
  BsPersonVcard,
  BsCart3,
  BsBell,
} from "react-icons/bs";
import { BiLogOut, BiSearchAlt } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import GlobalModalComp from "./GlobalModalComp";
import { useState } from "react";
import Link from "next/link";
import ProfileSettingModal from "./ProfileSettingModal";
import Search from "antd/es/input/Search";
import Searchbar from "@/utils/nm";
import SearchComp from "./SearchComp";

export default function TopLeftNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [string, setString] = useState<string>("");

  const handleClick = (comp: string) => {
    onOpen();
    setString(comp);
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
        <div className={style["top_notif"]}>
          <BsBell size={25} />
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
