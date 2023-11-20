"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const router = useRouter();
  useEffect(() => {
    router.push("/chat/channels/1337");
  }, []);
  return <></>;
}
