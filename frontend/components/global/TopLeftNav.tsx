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
          <BiSearchAlt className={style["search_icon"]} />
          <input type="text" placeholder="Search for players, channels..." />
        </div>
        <div className={style["top_notif"]}>
          <BsBell size={25} />
        </div>
      </div>
      <div className={style["left-bar"]}>
        <div className={style["left_menu"]}>
          <BsChatLeftText size={30} />
          <BsController size={30} />
          <BsPersonVcard size={30} />
          <BsCart3 size={30} />
        </div>
        <div className={style["left_bottom_menu"]}>
          <LuSettings size={30} />
          <BiLogOut size={30} />
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
