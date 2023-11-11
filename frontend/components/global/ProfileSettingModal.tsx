import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from "@nextui-org/react";
import axios from "axios";
import { useQuery } from "react-query";

import React, { useState } from "react";
import { Avatar, Input } from "antd";
import { BsFillCameraFill } from "react-icons/bs";
import { UserSquare } from "lucide-react";
import { postImage } from "@/utils/addUser";
import { send } from "process";
interface ProfileSettingModalProps {
  onClose: any;
}

export const ProfileSettingModal = ({ onClose }: ProfileSettingModalProps) => {
  const [checked, setChecked] = React.useState(false);
  // const { isLoading, error, data } = useQuery("profiles", async () => {
  //   return axios.get("http://localhost:4000/user/");
  // });
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return "An error has occurred: " + error.message;

  const [file, setFile] = useState(null);
  const { mutate } = postImage();

  const sendImage = async (file: any) => {
    mutate(file);
  };
  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();
    fileInput.addEventListener("change", (e: any) => {
      setFile(e.target.files[0]);
    });
  };

  if (file) {
    sendImage(file);
  }
  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-white font-ClashGrotesk-Semibold text-2xl">
          Settings
        </h1>
        <div className="relative h-24 w-24 mt-2">
          <Avatar
            src={"https://i.pravatar.cc/300?img=1"}
            size={100}
            className="relative"
          />
          <div
            onClick={handleClick}
            className="cursor-pointer  absolute w-10  h-10 rounded-full bg-white  flex items-center justify-center top-2/3 left-2/3"
          >
            <BsFillCameraFill className="w-5 h-5" />
          </div>
        </div>

        <h1 className="font-ClashGrotesk-Semibold text-white text-2xl text-center">
          {" "}
          Hamza Koranbi
        </h1>
        <div className=" flex flex-col gap-2">
          <h1 className="font-ClashGrotesk-Regular text-white text-lg ">
            {" "}
            Change UserName
          </h1>
          <Input size="large" className="bg-inherit text-white" />
        </div>
      </div>
      <div className="flex  items-center justify-between w-7/12 m-4">
        <h1 className="text-white font-ClashGrotesk-Regular text-base">
          Enable 2Fa
        </h1>
        <Switch
          defaultSelected
          aria-label="Automatic updates"
          onChange={() => setChecked(!checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-10">
        <Button
          // color="danger"
          className="bg-inherit text-white font-ClashGrotesk-Medium text-base text-center"
          // variant="light"
          onPress={onClose}
        >
          Cancel
        </Button>
        <Button
          className="bg-buttonbg text-white font-ClashGrotesk-Medium text-base min-w-auti min-h-auto rounded-2xl text-center"
          onPress={onClose}
        >
          {"Save"}
        </Button>
      </div>
    </>
  );
};

export default ProfileSettingModal;
