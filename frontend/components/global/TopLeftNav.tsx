"use client";
import style from "@/styles/components/TopLeftNav.module.scss";
import "@/styles/globals.scss";
import Image from "next/image";

import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react";
import GlobalModalComp from "./GlobalModalComp";
import { useState } from "react";

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
          <Image
            src="/assets/main/Navbar/Vector.svg"
            alt="logo"
            width={45}
            height={45}
          />
        </div>
        <div className={style["top_search"]}>
          <Image
            src="/assets/components/SearchIcon.svg"
            alt="search"
            width={20}
            height={20}
            className={style["search_icon"]}
          />
          <input type="text" placeholder="Search for players, channels..." />
        </div>
        <div className={style["top_notif"]}>
          <Image
            src="/assets/components/NotifBell.svg"
            alt="logo"
            width={30}
            height={30}
          />
        </div>
      </div>
      <div className={style["left-bar"]}>
        <div className={style["left_menu"]}>
          <Image
            src="/assets/components/Chat.svg"
            alt="logo"
            width={30}
            height={30}
          />
          <Image
            src="/assets/components/Game.svg"
            alt="logo"
            width={30}
            height={30}
          />
          <Image
            src="/assets/components/Profile.svg"
            alt="logo"
            width={30}
            height={30}
          />
          <Image
            src="/assets/components/Shop.svg"
            alt="logo"
            width={30}
            height={30}
          />
        </div>
        <div className={style["left_bottom_menu"]}>
          <Image
            onClick={() => handleClick("settings")}
            src="/assets/components/Setting.svg"
            alt="logo"
            width={30}
            height={30}
          />

          <Image
            onClick={() => handleClick("Logout")}
            src="/assets/components/Logout.svg"
            alt="logo"
            width={30}
            height={30}
          />
        </div>
      </div>
      <Modal hideCloseButton={true} isOpen={isOpen} onClose={onClose}>
        <ModalContent className="flex flex-col items-center justify-center bg-modalBackground w-full  p-12 rounded-[4rem]">
          <GlobalModalComp onClose={onClose} action={string} />
        </ModalContent>
      </Modal>
    </>
  );
}
