import React, { useEffect } from "react";
import LiveGameRec from "../molecules/LiveGameRec";
import MiniProf from "../molecules/MiniProf";
import Leadrboard from "../../Profile/organisms/Leadrboard";
import axios from "axios";

export const SocialFeed = () => {
  const [Friends, setFriends] = React.useState<any>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
        withCredentials: true,
      })
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="lg:flex lg:h-screen lg:justify-evenly lg:items-center">
      <div className="flex flex-col items-center justify-evenly gap-12 p-3 lg:flex-row md:ml-14 lg:items-baseline">
        <div className="mt-14 md:mt-24  border-1 border-white  rounded-3xl w-full max-h-[800px] p-6 lg:mt-0 xl:min-w-[700px] lg:min-w-[500px]">
          <h1 className="text-fontlight text-xl lg:text-3xl font-semibold text-center ">
            Leaderboard
          </h1>

          <div className="flex flex-col  gap-6 overflow-y-auto overflow-x-hidden mt-4">
            <Leadrboard MonStyle="Home" />
          </div>
        </div>
        <div className="border-1 border-white  rounded-3xl w-full  p-6 xl:min-w-[700px] lg:min-w-[500px]">
          <h1 className="text-fontlight text-xl lg:text-3xl font-semibold text-center">
            Invite Friends
          </h1>
          <div className="flex flex-row  justify-start flex-wrap   max-h-[800px] overflow-x-hidden gap-3 mt-4 overflow-y-auto ">
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
    </div>
  );
};

// const Friends = [
//   {
//     id: 1,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "John",
//   },
//   {
//     id: 2,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Jane",
//   },
//   {
//     id: 3,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Alex",
//   },
//   {
//     id: 4,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Lily",
//   },
//   {
//     id: 5,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Max",
//   },
//   {
//     id: 6,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Eva",
//   },
//   {
//     id: 7,
//     avatarUrl: "https://example.com/avatar7.n",
//     nickName: "Leo",
//   },
//   {
//     id: 8,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Mia",
//   },
//   {
//     id: 9,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Benjamin",
//   },
//   {
//     id: 10,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Isabella",
//   },
//   {
//     id: 10,
//     avatarUrl: "https://i.pravatar.cc/300?img=9",
//     nickName: "Isabella",
//   },
// ];
export default SocialFeed;
