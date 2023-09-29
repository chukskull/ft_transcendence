import { LiveGameRec } from "@/components/SPA/LiveGameRec";

// Define your Home component
export default function Home() {
  return (
    <div className="m-10">
      <div className="flex flex-row items-center justify-around mt-20 flex-grow gap-16 p-20">
        <div className="flex flex-col justify-center border-1 border-white flex-grow rounded-3xl max-w-xl lg:max-w-5xl ml-40">
          <div className="relative">
            <div className="absolute w-3 h-3 rounded-full bg-red-500 top-2/4 left-11"></div>
            <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6">
              Live Games
            </h1>
          </div>

          <div className="flex flex-col justify-center flex-grow px-12 gap-6 m-6">
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
        <div className="flex flex-col items-center border-2 flex-grow rounded-3xl max-w-xl lg:max-w-5xl">
          <h1 className="text-white text-4xl font-semibold py-6 px-12 mx-6">
            Invite Friends
          </h1>
          <div className="flex flex-row "></div>
        </div>
      </div>
    </div>
  );
}

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
