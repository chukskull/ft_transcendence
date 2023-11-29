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
  const [base64Image, setBase64Image] = useState<string | null>(null);

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
          setBase64Image(base64String);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert("File too big!");
      }
    });
    fileInput.click();
  };

  const updateUser = async () => {
    const formData = {
      nickName: name,
      image: base64Image,
      twoFactorAuthEnabled: checked,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        document.location.reload();
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
  // const func = (file: any) => {
  //   return new Promise((resolve, reject) => {
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         const base64Image = e.target.result;
  //         if (base64Image) {
  //           const blob = new Blob([file], { type: file.type });
  //           const base64URL = URL.createObjectURL(blob);
  //           resolve(base64URL);
  //         } else {
  //           reject("Failed to convert file to base64");
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       reject("No file provided");
  //     }
  //   });
  // };

  // const [imageUrl, setImageUrl] = useState<string | null>(null);

  // useEffect(() => {
  //   if (file) {
  //     console.log("File provided");
  //     func(file)
  //       .then((url: string) => {
  //         console.log(url);
  //         setImageUrl(url);
  //       })
  //       .catch((error: string) => {
  //         console.error(error);
  //       });
  //   } else {
  //     console.log("No file");
  //   }
  // }, [file]);

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
              alt="Avatar"
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
