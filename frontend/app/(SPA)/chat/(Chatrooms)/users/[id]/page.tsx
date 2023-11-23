"use client";
import ChatRooms from "@/components/SPA/chat/pages/ChatRooms";
import { useParams } from "next/navigation";
import React from "react";

export default function UsersPage() {
  const params = useParams();
  console.log("PARAMS", params);
  return <ChatRooms id={params.id} isGroup={false}/>;
}
