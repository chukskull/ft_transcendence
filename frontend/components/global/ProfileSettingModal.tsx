"use client";
import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { Input } from "@nextui-org/react";
import { BsFillCameraFill } from "react-icons/bs";
import axios from "axios";
import { Button, Switch } from "@nextui-org/react";
import { useForm } from "react-hook-form";

interface ProfileSettingModalProps {
  onClose: any;
}

export const ProfileSettingModal: React.FC<ProfileSettingModalProps> = ({
  onClose,
}) => {
  const [checked, setChecked] = useState(false);
  const [myData, setMyData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
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
        alert("File too large");
      }
    });
    fileInput.click();
  };

  const updateUser = async (user: any) => {
    setValue("twoFa", checked);
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`, user, {
        withCredentials: true,
      })
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 2fs on off
  const handle2Fa = (checked: boolean) => {
    if (!checked) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/2fa/generate`, {
          withCredentials: true,
        })
        .then((res) => {
          setQrCode(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    } else {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/turn-off`, {
          withCredentials: true,
        })
        .then((res) => {
          setQrCode(null);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const activate2Fa = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/2fa/turn-on`,
        {
          pin,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        window.location.reload();
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
      nickName: myData?.nickName,
      qrCode: null,
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
                maxLength: 10,
                validate: {
                  alphanumeric: (value) =>
                    /^[a-zA-Z0-9]+$/.test(value) ||
                    "Only alphabets and numbers are allowed",
                },
              })}
              className="bg-inherit text-fontlight"
              type="text"
              size="sm"
              isInvalid={errors.nickName ? true : false}
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
              handle2Fa(checked);
            }}
          />
        </div>
        {qrCode && checked && (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-fontlight font-ClashGrotesk-Regular text-base">
              Scan QR Code
            </h1>
            <img src={qrCode} alt="qr code" className="rounded-lg" />
            <Input
              {...register("qrCode", {
                maxLength: 6,
                validate: {
                  noSpace: (value: any) => !/\s/.test(value),
                },
              })}
              className="bg-inherit text-fontlight"
              type="text"
              size="sm"
              isInvalid={errors.qrCode ? true : false}
              // variant="bordered"
              placeholder="Enter 6 digit code"
              onChange={(e) => {
                setPin(e.target.value);
              }}
            />
            <Button
              type="button"
              onClick={() => {
                activate2Fa();
              }}
              className="bg-green-500 text-fontlight font-ClashGrotesk-Medium text-base rounded-md text-center relative mt-[-3.2rem] z-100 mr-[-19rem]"
            >
              2fa on
            </Button>
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
            type="submit"
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
