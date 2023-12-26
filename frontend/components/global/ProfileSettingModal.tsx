"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Skeleton } from "antd";
import { Input } from "@nextui-org/react";
import { BsFillCameraFill } from "react-icons/bs";
import axios from "axios";
import { Button, Switch } from "@nextui-org/react";
import { SkeletonComp } from "./Skeleton";
import { useForm } from "react-hook-form";
import { set } from "lodash";

interface ProfileSettingModalProps {
  onClose: any;
}

export const ProfileSettingModal: React.FC<ProfileSettingModalProps> = ({
  onClose,
}) => {
  const [checked, setChecked] = useState(false);
  const [myData, setMyData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [name, setName] = useState("");

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", (e: any) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.size <= 500 * 1024) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const base64String = event.target.result;
          setFile(selectedFile);
          setValue("avatarUrl", base64String);
        };
        reader.readAsDataURL(selectedFile);
      } else {
      }
    });
    fileInput.click();
  };

  const updateUser = async (user: any) => {
    setValue("twoFa", checked);
    console.log(user, user.avatarUrl.length);
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`, user, {
        withCredentials: true,
      })
      .then((res) => {
        // window.location.reload();
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  // 2fs on off
  const handle2Fa = () => {
    const endPoint = checked ? "disable" : "enable";
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/2fa`, {
        withCredentials: true,
      })
      .then((res) => {
        setQrCode(res.data);
      })
      .catch((err) => {
        console.log(err);
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickName: "",
      avatarUrl: "noChange",
      twoFa: checked,
    },
  });
  return (
    <>
      <form className="flex flex-col  gap-3">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-fontlight font-ClashGrotesk-Semibold text-2xl">
            Settings
          </h1>
          <div className="relative h-24 w-24 mt-2">
            <Avatar
              src={file ? URL.createObjectURL(file) : myData?.avatarUrl}
              size={100}
              className="relative"
              alt="Avatar"
            />
            <div
              onClick={handleClick}
              className="cursor-pointer absolute w-10  h-10 rounded-full bg-white flex items-center justify-center top-2/3 left-2/3"
            >
              <BsFillCameraFill className="w-5 h-5" />
            </div>
          </div>

          <h1 className="font-ClashGrotesk-Semibold text-fontlight text-2xl text-center">
            {myData?.nickName}
          </h1>
          <div className="flex flex-col gap-2">
            <h1 className="font-ClashGrotesk-Regular text-fontlight text-lg">
              Change UserName
            </h1>
            <Input
              {...register("nickName", {
                maxLength: 15,
                minLength: 3,
                validate: {
                  noSpace: (value) => !/\s/.test(value),
                },
              })}
              className="bg-inherit text-fontlight"
              type="text"
              size="sm"
              isInvalid={errors.nickName ? true : false}
              errorMessage={errors.nickName && errors.nickName.message}
              // variant="bordered"
              placeholder="new username"
            />
          </div>
        </div>
        <div className="flex  items-center justify-between px-2 my-4">
          <h1 className="text-fontlight font-ClashGrotesk-Regular text-base">
            Enable 2Fa
          </h1>

          <Switch
            color="danger"
            isSelected={checked}
            aria-label="Automatic updates"
            onChange={() => {
              setChecked(!checked);
              handle2Fa();
            }}
          />
        </div>
        {qrCode && checked && (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-fontlight font-ClashGrotesk-Regular text-base">
              Scan QR Code
            </h1>
            <img src={qrCode} alt="qr code" />
          </div>
        )}
        <div className="flex items-center justify-between gap-8">
          <Button
            className="bg-inherit text-fontlight font-ClashGrotesk-Medium text-base text-center"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            // type="submit"
            onClick={handleSubmit(updateUser)}
            className="bg-buttonbg text-fontlight font-ClashGrotesk-Medium text-base min-w-auti min-h-auto rounded-2xl text-center"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileSettingModal;
