import React from "react";
import LiveGameRec from "../molecules/LiveGameRec";
import MiniProf from "../molecules/MiniProf";

export const SocialFeed = () => {
  return (
    <div className="flex flex-row max-sm:items-center  gap-16 p-20 max-lg:flex-col max-sm:ml-14 max-sm:p-10 max-md:p-10 md:h-3/4">
      <div className="flex flex-col  flex-grow border-1 border-white  rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-xs">
        <div className="relative">
          <div className="absolute w-3 h-3 rounded-full bg-red-500 top-2/4 left-11 max-sm:hidden"></div>
          <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6 max-sm:px-6 max-sm:py-3 max-sm:mx-3">
            Live Games
          </h1>
        </div>

        <div className="flex flex-col   px-12 gap-6 m-6 max-sm:px-6 max-sm:gap-3 max-sm:m-3 overflow-y-auto">
          {fakeData.length > 0 ? (
            fakeData.map((game, index) => (
              <LiveGameRec
                key={index}
                LeftProf={game.imageLeft}
                RightProf={game.imageRight}
                scoreLeft={game.scoreLeft}
                scoreRight={game.scoreRight}
                boolBut={true}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center  ">
              <h1 className="text-gray-400 text-4xl font-semibold ">
                No Live Games
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col  border-2  rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-fit">
        <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6 max-sm:px-6 max-sm:py-3 max-sm:mx-3">
          Invite Friends
        </h1>
        <div className="flex flex-row  justify-center  m-5 flex-wrap gap-6 max-sm:gap-6 max-sm:px-10 overflow-y-auto">
          {Friends.length > 0 ? (
            Friends.map((friend, index) => (
              <MiniProf key={index} image={friend.imaeg} name={friend.name} />
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
const fakeData = [
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=2",
    scoreLeft: 0,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=3",
    imageRight: "https://i.pravatar.cc/300?img=4",
    scoreLeft: 1,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=5",
    imageRight: "https://i.pravatar.cc/300?img=6",
    scoreLeft: 8,
    scoreRight: 2,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=7",
    imageRight: "https://i.pravatar.cc/300?img=8",
    scoreLeft: 4,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=9",
    imageRight: "https://i.pravatar.cc/300?img=10",
    scoreLeft: 9,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=11",
    imageRight: "https://i.pravatar.cc/300?img=12",
    scoreLeft: 1,
    scoreRight: 5,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=13",
    imageRight: "https://i.pravatar.cc/300?img=14",
    scoreLeft: 3,
    scoreRight: 4,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=15",
    imageRight: "https://i.pravatar.cc/300?img=16",
    scoreLeft: 1,
    scoreRight: 3,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=13",
    imageRight: "https://i.pravatar.cc/300?img=14",
    scoreLeft: 3,
    scoreRight: 4,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=15",
    imageRight: "https://i.pravatar.cc/300?img=16",
    scoreLeft: 1,
    scoreRight: 3,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=13",
    imageRight: "https://i.pravatar.cc/300?img=14",
    scoreLeft: 3,
    scoreRight: 4,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=15",
    imageRight: "https://i.pravatar.cc/300?img=16",
    scoreLeft: 1,
    scoreRight: 3,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=13",
    imageRight: "https://i.pravatar.cc/300?img=14",
    scoreLeft: 3,
    scoreRight: 4,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=15",
    imageRight: "https://i.pravatar.cc/300?img=16",
    scoreLeft: 1,
    scoreRight: 3,
  },
];
