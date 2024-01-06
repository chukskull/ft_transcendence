"use client";
import ChatRooms from "@/components/SPA/chat/ChatRooms";
import { useParams } from "next/navigation";
import React from "react";

export default function ChannelsPage() {
  const params = useParams();

  return <ChatRooms id={params.id} isGroup={true} />;
}
