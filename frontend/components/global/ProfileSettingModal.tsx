import React, { useState, useEffect } from "react";
import { Avatar, Input, Skeleton } from "antd";
import { BsFillCameraFill } from "react-icons/bs";
import axios from "axios";
import { Button, Switch } from "@nextui-org/react";
import { SkeletonComp } from "./Skeleton";

interface ProfileSettingModalProps {
  onClose: any;
}

export const ProfileSettingModal: React.FC<ProfileSettingModalProps> = ({
  onClose,
}) => {
  const [checked, setChecked] = useState(false);
  const [myData, setMyData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");

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

  const updateUser = async () => {
    const formData = {
      nickName: name,
      avatarUrl: file,
      twoFactorAuthEnabled: checked,
    };
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setMyData(res.data);
        setChecked(res.data.twoFactorAuthEnabled);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <form className="flex flex-col  gap-3">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-white font-ClashGrotesk-Semibold text-2xl">
            Settings
          </h1>
          <div className="relative h-24 w-24 mt-2">
            <Avatar
              src={file ? URL.createObjectURL(file) : myData?.avatarUrl}
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
            {myData?.nickName}
          </h1>
          <div className="flex flex-col gap-2">
            <h1 className="font-ClashGrotesk-Regular text-white text-lg">
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
            color="danger"
            isSelected={checked}
            aria-label="Automatic updates"
            onChange={() => setChecked(!checked)}
          />
        </div>

        <div className="flex items-center justify-between gap-8">
          <Button
            className="bg-inherit text-white font-ClashGrotesk-Medium text-base text-center"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            // type="submit"
            onClick={updateUser}
            className="bg-buttonbg text-white font-ClashGrotesk-Medium text-base min-w-auti min-h-auto rounded-2xl text-center"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileSettingModal;
