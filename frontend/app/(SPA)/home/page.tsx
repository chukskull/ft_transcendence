"use client";
import { LiveGameRec } from "@/components/SPA/home/LiveGameRec";
import { MiniProf } from "@/components/SPA/home/MiniProf";
import { Button, Checkbox } from "@nextui-org/react";

// Define your Home component

/*
color: #FFF;
font-family: Clash Grotesk;
font-size: 15px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: -0.3px;
text-transform: uppercase;*/
export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row max-sm:items-center  mt-20 flex-grow gap-16 p-20 max-lg:flex-col max-sm:ml-14 max-sm:p-10 max-md:p-10">
        <div className="flex flex-col justify-center border-1 border-white flex-grow rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-xs">
          <div className="relative">
            <div className="absolute w-3 h-3 rounded-full bg-red-500 top-2/4 left-11 max-sm:hidden"></div>
            <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6 max-sm:px-6 max-sm:py-3 max-sm:mx-3">
              Live Games
            </h1>
          </div>

          <div className="flex flex-col justify-center flex-grow px-12 gap-6 m-6 max-sm:px-6 max-sm:gap-3 max-sm:m-3">
            {fakeData.length > 0 ? (
              fakeData.map((game, index) => (
                <LiveGameRec
                  key={index}
                  LeftProf={game.imageLeft}
                  RightProf={game.imageRight}
                  scoreLeft={game.scoreLeft}
                  scoreRight={game.scoreRight}
                />
              ))
            ) : (
              <div className="flex flex-col justify-center flex-grow ">
                <h1 className="text-gray-400 text-4xl font-semibold ">
                  No Live Games
                </h1>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col  border-2 flex-grow rounded-3xl max-w-xl lg:max-w-5xl max-sm:max-w-fit">
          <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6 max-sm:px-6 max-sm:py-3 max-sm:mx-3">
            Invite Friends
          </h1>
          <div className="flex flex-row  flex-wrap gap-12 px-20 py-10 max-sm:gap-6 max-sm:px-10 max-sm:py-5">
            {Friends.length > 0 ? (
              Friends.map((friend, index) => (
                <MiniProf key={index} image={friend.imaeg} name={friend.name} />
              ))
            ) : (
              <div className="flex flex-col justify-center flex-grow ">
                <h1 className="text-gray-400 text-4xl font-semibold ">
                  No Friends
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-7 mb-4">
        <h1 className="text-white font-bold text-2xl text-center">
          {" "}
          SELECT GAME:
        </h1>
        <div className="flex flex-row justify-center items-center">
          <Checkbox defaultSelected data-hover data-focus className="ml-6">
            <span className="text-white">Normal game</span>
          </Checkbox>
          <Checkbox defaultSelected data-hover data-focus className="ml-6">
            <span className="text-white">Ranked game</span>
          </Checkbox>
        </div>
        <Button
          className="bg-live text-white font-semibold text-base max-w-[239px]"
          data-hover
          data-focus
        >
          JOIN MATCHMAKING
        </Button>
      </div>
    </div>
  );
}

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
];
