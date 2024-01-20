"use client";
import { Button, Input } from "@nextui-org/react";
import "@/styles/globals.scss";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Avatar } from "antd";
import { BsFillCameraFill } from "react-icons/bs";

interface Styles {
  label: string;
  input: string[];
  innerWrapper: string;
  inputWrapper: string[];
}

const styles: Styles = {
  label: "text-gray-400 dark:text-silver/90 font-bold text-sm mb-1 pl-2",
  input: [
    "bg-transparent",
    "text-silver dark:text-silver/90",
    "placeholder:text-silver dark:placeholder:text-silver/60",
    "placeholder-opacity-60",
    "pl-2",
    "font-bold",
  ],
  innerWrapper: "bg-transparent",
  inputWrapper: [
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
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

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
          setValue("base64Image", base64String);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert("File too big!");
      }
    });
    fileInput.click();
  };

  const addNewUser = async (user: any) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/fill`, user, {
        withCredentials: true,
      })
      .then(() => {
        router.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: "",
      base64Image: null,
    },
  });

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rectangle flex  items-center justify-center">
          <form action="" className="w-[80%]">
            <div className=" flex flex-col items-center justify-center gap-12">
              <div className="relative h-24 w-24 mt-2">
                <Avatar
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://shorturl.at/djENR"
                  }
                  size={120}
                  className="relative"
                  alt="Avatar"
                />
                <div
                  onClick={handleClick}
                  className="cursor-pointer absolute w-10  h-10 rounded-full bg-white flex items-center justify-center top-3/4 left-[5rem]"
                >
                  <BsFillCameraFill className="w-5 h-5" />
                </div>
              </div>
              <Input
                {...register("firstName", {
                  required: "This field is required",
                  maxLength: 15,
                  minLength: 3,
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "No spaces are allowed",
                  },
                })}
                type="firstName"
                label="First Name"
                variant="bordered"
                isInvalid={errors.firstName ? true : false}
                errorMessage={errors.firstName && errors.firstName.message}
                classNames={{
                  ...styles,
                }}
              />

              <Input
                {...register("lastName", {
                  required: "This field is required",
                  maxLength: 20,
                  minLength: 3,
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "No spaces are allowed",
                  },
                })}
                type="lastname"
                label="Last Name"
                isInvalid={errors.lastName ? true : false}
                errorMessage={errors.lastName && errors.lastName.message}
                variant="bordered"
                classNames={{
                  ...styles,
                }}
              />

              <Input
                {...register("nickName", {
                  required: "This field is required",
                  maxLength: 10,
                  minLength: 3,
                  validate: {
                    alphanumeric: (value) =>
                      /^[a-zA-Z0-9]+$/.test(value) ||
                      "Only alphabets and numbers are allowed",
                  },
                })}
                type="nickname"
                label="Nickname"
                variant="bordered"
                isInvalid={errors.nickName ? true : false}
                errorMessage={errors.nickName && errors.nickName?.message}
                classNames={{
                  ...styles,
                }}
              />

              <Button
                type="submit"
                className="mt-2 w-[140px] h-[40px] gradient-button 
           text-silver shadow-lg rounded-3xl font-ClashGrotesk-Medium text-lg"
                onClick={handleSubmit(addNewUser)}
              >
                Play
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
