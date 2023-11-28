import React from 'react';
import ProfileComp from "../molecules/ProfileComp";

interface AchievementProps {
    data?: any;
}

export const Achievement = ({data}:AchievementProps) => {
  data = dwita;
    if (!data || data.length === 0) {
        return (
          <div className="flex flex-col justify-center">
            <h1 className="text-gray-400 text-3xl font-semibold text-center">
              No Achievements
            </h1>
          </div>
        );
      }
  return (
    <div className="flex flex-col items-center justify-center gap-4  w-full px-5">
      {data?.map((achiv: any) => (
        <div
          key={achiv.id}
          className={`border-1 border-none rounded-2xl bg-purpleProfile h-20 flex justify-start items-center p-5 gap-6 w-full`}
        >

          <ProfileComp
            img={achiv.icon}
            nickName={achiv.name}
            firstName={achiv.description}
            id={achiv.id}
            channelId={achiv.id}
            type={"achiv"}
          />
        </div>
      ))}
    </div>
  )
}

export default Achievement;
const dwita = [
  {
    icon: "https://img.icons8.com/color/480/award.png",
    name: "Achievement 1",
    description: "f Achievement 1",
    id: 1,
  },
  {
    icon: "https://img.icons8.com/color/480/cup.png",
    name: "Achievement 2",
    description: "bruhbruhbruhbruhbruhbruh",
    id: 2,
  },
  {
    icon: "https://img.icons8.com/color/480/trophy.png",
    name: "Achievement 3",
    description: "The quick brown fox jumps.",
    id: 3,
  },
];
