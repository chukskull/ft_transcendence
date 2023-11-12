"use client";
import ProfileComp from "@/components/SPA/Profile/pages/ProfileComp";

import React from "react";

export const Profile = ({ params }: { params: { slug: string } }) => {
  return <div>{<ProfileComp id={params.slug} />}</div>;
};

export default Profile;
