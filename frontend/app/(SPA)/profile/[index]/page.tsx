"use client";
import ProfileComp from "@/components/SPA/Profile/pages/ProfileComp";
import { useRouter } from "next/navigation";
import React from "react";

export const Profile = () => {
  const router = useRouter();
  const { query } = router;
  let user: string | undefined;

  if (query) {
    const { id } = query; // Safely destructure 'id' from query object
    user = id as string;
  }

  return (
    <div>
      {user && <ProfileComp id={user} />}
    </div>
  );
};

export default Profile;
