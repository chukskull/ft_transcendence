"use client";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import "@/styles/globals.scss";
import { useAddUser } from "@/utils/addUser";

interface Styles {
  label: string;
  input: string[];
  innerWrapper: string;
  inputWrapper: string[];
}

const styles: Styles = {
  label: "text-gray-400 dark:text-white/90 font-bold text-sm mb-1 pl-2",
  input: [
    "bg-transparent",
    "text-white dark:text-white/90",
    "placeholder:text-white dark:placeholder:text-white/60",
    "placeholder-opacity-60",
    "pl-2",
    "font-bold",
  ],
  innerWrapper: "bg-transparent",
  inputWrapper: [
    "w-80",
    "h-[48px]",
    "rounded-3xl",
    "border-0",
    "shadow-xl",
    "bg-transparent",
    "hover-within:text-black/80",
    "backdrop-blur-xl",
    "backdrop-saturate-200",
    "!cursor-text",
  ],
};

export default function Fill() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const { mutate } = useAddUser();

  function addNewUser() {
    console.log(name, lastName, nickName);
    const user = { name, lastName, nickName };
    mutate(user);
  }

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rectangle flex  items-center justify-center">
          <div className="w-80 flex flex-col items-center justify-center gap-12">
            <Input
              type="name"
              label="Name"
              isClearable
              variant="bordered"
              classNames={{
                ...styles,
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="lastname"
              label="Last Name"
              isClearable
              variant="bordered"
              classNames={{
                ...styles,
              }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              type="nickname"
              label="Nickname"
              isClearable
              variant="bordered"
              classNames={{
                ...styles,
              }}
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <Button
              className="mt-2 w-[140px] h-[40px] gradient-button 
           text-white shadow-lg rounded-3xl"
              onClick={addNewUser}
            >
              Play
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
