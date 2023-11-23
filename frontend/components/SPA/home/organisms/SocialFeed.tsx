import React, { useEffect } from "react";
import LiveGameRec from "../molecules/LiveGameRec";
import MiniProf from "../molecules/MiniProf";
import Leadrboard from "../../Profile/organisms/Leadrboard";
import axios from "axios";

export const SocialFeed = () => {
  const [Friends, setFriends] = React.useState<any>([]);
  useEffect(() => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
          withCredentials: true,
        })
        .then((res) => {
          setFriends(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className="flex flex-row max-sm:items-center  gap-16 px-20 max-lg:flex-col max-sm:ml-14 max-sm:p-10 max-md:p-10 md:h-[80%]">
      <div className="flex flex-col  flex-grow border-1 border-white  rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-xs">
        <h1 className="text-white text-3xl font-semibold py-6 px-12 mx-6 max-sm:px-6  max-sm:mx-3">
          Leaderboard
        </h1>

        <div className="flex flex-col   px-12 gap-6 m-6 max-sm:px-6 max-sm:gap-3 max-sm:m-3 overflow-y-auto">
          <Leadrboard MonStyle="Home" />
        </div>
      </div>
      <div className="flex flex-col  border-2  rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-fit">
        <h1 className="text-white text-3xl font-semibold py-6 px-12 mx-6 max-sm:px-6 max-sm:py-3 max-sm:mx-3">
          Invite Friends
        </h1>
        <div className="flex flex-row  justify-center  m-5 flex-wrap gap-6 max-sm:gap-6 max-sm:px-10 overflow-y-auto">
          {Friends.length > 0 ? (
            Friends.map((friend: any) => (
              <MiniProf
                key={friend.id}
                image={friend.avatarUrl}
                name={friend.nickName}
                id={friend.id}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center  ">
              <h1 className="text-gray-400 text-4xl font-semibold ">
                No Friends
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Friends = [
  {
    imaeg: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=2",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=3",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=4",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=5",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=6",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=7",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=8",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=9",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=10",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=11",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=12",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=13",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=14",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=15",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=16",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=17",
    name: "John Doe",
  },
  {
    imaeg: "https://i.pravatar.cc/300?img=18",
    name: "John Doe",
  },
];
