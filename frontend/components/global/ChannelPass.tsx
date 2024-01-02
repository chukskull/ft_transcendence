"use client";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { LockIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export const ProtectedModal = ({
  channelId,
  showModal,
}: {
  channelId: any;
  showModal: (s: boolean) => any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = (data: any) => {
    const { password } = data;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channelId}/join`,
        { password },
        { withCredentials: true }
      )
      .then((res) => {
        router.push(`/chat/channels/${channelId}`);
        showModal(false);
      })
      .catch((err) => {
        // console.log(err);
        alert(err.response.data.message);
      });
  };

  return (
    <div className="p-12 flex flex-col gap-5 w-[90%]">
      <h1 className="text-xl font-ClashGrotesk-Semibold text-fontlight w-[90%] text-center">
        {" "}
        Please enter the password to join
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          {...register("password", {
            required: true,
            minLength: 3,
          })}
          endContent={
            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          className="font-ClashGrotesk-Medium "
          label="Password"
          placeholder="Enter your password"
          type="password"
          errorMessage={errors.password && "This field is required"}
          variant="bordered"
        />

        <Button
          type="submit"
          className="font-ClashGrotesk-Medium text-fontlight bg-buttonbg"
        >
          Join
        </Button>
      </form>
    </div>
  );
};
