"use client";
import ProfileComp from "@/components/SPA/Profile/pages/ProfileComp";
import { useParams } from "next/navigation";

import React from "react";

const Profile = async () => {
  const params = useParams();
  return <ProfileComp id={params.index} />;
};

export default Profile;
