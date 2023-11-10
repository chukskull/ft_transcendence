import React from "react";
import ProfileComp from "../molecules/ProfileComp";
import { useQuery } from "react-query";
import { getLeadProfiles } from "@/utils/getLeadProfiles";

interface LeaderboardProps {
  MonStyle: "Home" | "Profile";
}

export const Leadrboard = ({ MonStyle }: LeaderboardProps) => {
  const { isLoading, error, data } = useQuery("profiles", async () => {
    return getLeadProfiles();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return "An error has occurred: " + error.message;

  // Optimize rendering by checking data length before mapping
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center">
        <h1 className="text-gray-400 text-4xl font-semibold">No Users :</h1>
      </div>
    );
  }

  let bgStyle: string =
    MonStyle === "Profile" ? "bg-purpleProfile" : "bg-friend";
  let colors: string[] = ["#ffc500", "#C0C0C0", "#cd7f32"];
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow ">
      {data?.map((user, index) => (
        <div
          key={user.id} // Use a unique identifier for each user
          className={`border-1 border-none rounded-2xl w-full ${bgStyle}  h-20 flex justify-center p-4`}
        >
          <span className="text-center text-white font-ClashGrotesk-Semibold text-lg flex items-center pr-12 ">
            #{index + 1}
          </span>

          <ProfileComp
            // key={index} // Remove redundant key prop for ProfileComp
            img={user.img}
            nickName={user.nickName}
            firstName={user.firstName}
            lastName={user.lastName}
            color={colors[index]}
          />
        </div>
      ))}
    </div>
  );
};

export default Leadrboard;
