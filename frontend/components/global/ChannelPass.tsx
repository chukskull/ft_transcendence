import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { LockIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export const ProtectedModal = ({ channelId }: { channelId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    const router = useRouter();
    const { password } = data;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channelId}/join`,
        { password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          router.push(`/chat/channels/${channelId}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-12 flex flex-col gap-5 w-[90%]">
      <h1 className="text-xl font-ClashGrotesk-Semibold text-white w-[90%] text-center">
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
          className="font-ClashGrotesk-Medium text-white bg-buttonbg"
        >
          Join
        </Button>
      </form>
    </div>
  );
};
