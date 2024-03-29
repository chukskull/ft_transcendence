"use client";
import ProfileComp from "@/components/SPA/Profile/pages/ProfileComp";
import axios from "axios";
import { useParams } from "next/navigation";

import React from "react";
import { useQuery } from "react-query";

const Profile = () => {
  const params = useParams();
  const { isLoading, data, error } = useQuery("getSession", async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  });
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;
  console.log(
    data.nickName,
    params.index,
    "nancy ajram",
    data.nickName === `${params.index}`.toLowerCase()
  );
  if (data?.nickName.toLowerCase() === `${params.index}`.toLowerCase()) {
    return (
      <div className="p-14">
        <ProfileComp id={"me"} />
      </div>
    );
  }
  return (
    <div className="p-14">
      <ProfileComp id={params.index} />
    </div>
  );
};

export default Profile;
