import React, { useState, useEffect } from "react";
import { Avatar, Input } from "antd";
import { BsFillCameraFill } from "react-icons/bs";

import { Button, Switch } from "@nextui-org/react";

import { useUpdate } from "@/utils/UpdaTeUser";
import { send } from "process";

interface ProfileSettingModalProps {
  onClose: any;
}

export const ProfileSettingModal: React.FC<ProfileSettingModalProps> = ({
  onClose,
}) => {
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isLoading } = useUpdate();

  const Update = async (data: any) => {
    if (data) {
      mutate(data);
    }
  };

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", (e: any) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    });
  };

  const sendUpdate = async () => {
    const s = {} as any;
    if (file !== null) {
      s.image = file;
    }
    s.enableTwoFa = !checked;
    s.name = name;

    return Update(s);
  };

  const handleOnClose = () => {
    onClose();
    setTimeout(() => {
      setChecked(false);
      setName("");
      setFile(null);
    }, 1000);
  };

  return (
    <>
      <form className="flex flex-col  gap-3" onSubmit={sendUpdate}>
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-white font-ClashGrotesk-Semibold text-2xl">
            Settings
          </h1>
          <div className="relative h-24 w-24 mt-2">
            <Avatar
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://i.pravatar.cc/300?img=1"
              }
              size={100}
              className="relative"
            />
            <div
              onClick={handleClick}
              className="cursor-pointer absolute w-10  h-10 rounded-full bg-white flex items-center justify-center top-2/3 left-2/3"
            >
              <BsFillCameraFill className="w-5 h-5" />
            </div>
          </div>

          <h1 className="font-ClashGrotesk-Semibold text-white text-2xl text-center">
            {" "}
            Hamza Koranbi
          </h1>
          <div className="flex flex-col gap-2">
            <h1 className="font-ClashGrotesk-Regular text-white text-lg">
              {" "}
              Change UserName
            </h1>
            <Input
              minLength={3}
              maxLength={12}
              type="name"
              aria-label="Name"
              className="bg-inherit text-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex  items-center justify-between px-2 my-4">
          <h1 className="text-white font-ClashGrotesk-Regular text-base">
            Enable 2Fa
          </h1>

          <Switch
            defaultSelected
            aria-label="Automatic updates"
            onChange={() => setChecked(!checked)}
          />
        </div>

        <div className="flex items-center justify-between gap-8">
          <Button
            className="bg-inherit text-white font-ClashGrotesk-Medium text-base text-center"
            onClick={handleOnClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-buttonbg text-white font-ClashGrotesk-Medium text-base min-w-auti min-h-auto rounded-2xl text-center"
            disabled={isLoading}
            onClick={handleOnClose}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileSettingModal;
