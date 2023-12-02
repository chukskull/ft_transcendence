"use client";
import { Button, Input } from "@nextui-org/react";
import "@/styles/globals.scss";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
interface Styles {
  label: string;
  input: string[];
  innerWrapper: string;
  inputWrapper: string[];
}

const styles: Styles = {
  label: "text-gray-400 dark:text-fontlight/90 font-bold text-sm mb-1 pl-2",
  input: [
    "bg-transparent",
    "text-fontlight dark:text-fontlight/90",
    "placeholder:text-fontlight dark:placeholder:text-fontlight/60",
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
  const addNewUser = async (user: any) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/fill`, user, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 201) {
          router.push("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: "",
    },
  });

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rectangle flex  items-center justify-center">
          <form action="" className="w-[80%]">
            <div className=" flex flex-col items-center justify-center gap-12">
              <Input
                {...register("firstName", {
                  required: "This field is required",
                  maxLength: 15,
                  minLength: 3,
                })}
                type="firstName"
                label="First Name"
                variant="bordered"
                isInvalid={errors.firstName ? true : false}
                errorMessage={errors.firstName && "This field is required"}
                classNames={{
                  ...styles,
                }}
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />

              <Input
                {...register("lastName", {
                  required: "This field is required",
                  maxLength: 20,
                  minLength: 3,
                })}
                type="lastname"
                label="Last Name"
                isInvalid={errors.lastName ? true : false}
                errorMessage={errors.lastName && errors.lastName.message}
                variant="bordered"
                classNames={{
                  ...styles,
                }}
                // value={lastName}
                // onChange={(e) => setLastName(e.target.value)}
              />

              <Input
                {...register("nickName", {
                  required: "This field is required",
                  maxLength: 15,
                  minLength: 3,
                })}
                type="nickname"
                label="Nickname"
                variant="bordered"
                isInvalid={errors.nickName ? true : false}
                errorMessage={errors.nickName && errors.nickName?.message}
                classNames={{
                  ...styles,
                }}
                // value={nickName}
                // onChange={(e) => setNickName(e.target.value)}
              />

              <Button
                type="submit"
                className="mt-2 w-[140px] h-[40px] gradient-button 
           text-fontlight shadow-lg rounded-3xl"
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
