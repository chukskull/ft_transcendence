import React from "react";
import ProfileComp from "../molecules/ProfileComp";
import { useQuery } from "react-query";
import { getLeadProfiles } from "@/api/getLeadProfiles";

export const Leadrboard = () => {
  const { isLoading, error, data } = useQuery("profiles", async () => {
    return getLeadProfiles();
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {data?.map((user, index) => (
        <div
          key={index}
          className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex  justify-center"
        >
          <h1 className="text-center text-white  font-ClashGrotesk-Semibold text-lg flex items-center pr-12">
            #{index + 1}
          </h1>
          <ProfileComp
            // key={index}
            img={user.img}
            nickName={user.nickName}
            firstName={user.firstName}
            lastName={user.lastName}
          />
        </div>
      ))}
    </div>
  );
};
export default Leadrboard;
