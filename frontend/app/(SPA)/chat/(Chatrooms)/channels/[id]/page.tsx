"use client";
import ChatRooms from "@/components/SPA/chat/pages/ChatRooms";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function ChannelsPage() {
  const params = useParams();

  return <ChatRooms id={params.id} isGroup={true} />;
}
