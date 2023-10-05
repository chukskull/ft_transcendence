import React from "react";
import ProfileComp from "../molecules/ProfileComp";
import LiveGameRec from "../../home/molecules/LiveGameRec";

interface MiddleComponentProps {
  index: number;
}

export const MiddleComponent = ({ index }: MiddleComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-grow p-7">
      {index === 0
        ? user.map((user, index) => (
            <div
              key={index}
              className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex  justify-center"
            >
              <ProfileComp
                // key={index}
                img={user.img}
                nickName={user.nickName}
                firstName={user.firstName}
                lastName={user.lastName}
              />
            </div>
          ))
        : index === 1
        ? fakeData.map((data, index) => (
            <LiveGameRec
              key={index}
              LeftProf={data.imageLeft}
              RightProf={data.imageRight}
              scoreLeft={data.scoreLeft}
              scoreRight={data.scoreRight}
              boolBut={false}
            />
          ))
        : Channels.map((channel, index) => (
            <div
              key={index}
              className="border-1 border-none rounded-2xl w-full bg-purpleProfile h-20 flex  justify-center"
            >
              <ProfileComp
                // key={index}
                img={channel.img}
                nickName={channel.nickName}
                firstName={channel.name}
              />
            </div>
          ))}
    </div>
  );
};

const user = [
  {
    img: "https://i.pravatar.cc/300?img=1",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=2",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=3",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=4",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=5",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=6",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=7",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=8",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    img: "https://i.pravatar.cc/300?img=9",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
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
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=4",
    scoreLeft: 1,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=6",
    scoreLeft: 8,
    scoreRight: 2,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=8",
    scoreLeft: 4,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=10",
    scoreLeft: 9,
    scoreRight: 0,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=12",
    scoreLeft: 1,
    scoreRight: 5,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=14",
    scoreLeft: 3,
    scoreRight: 4,
  },
  {
    imageLeft: "https://i.pravatar.cc/300?img=1",
    imageRight: "https://i.pravatar.cc/300?img=16",
    scoreLeft: 1,
    scoreRight: 3,
  },
];

const Channels = [
  {
    img: "https://cdn.discordapp.com/attachments/877643868007510272/877643897971959828/unknown.png",
    nickName: "private",
    name: "Pedago",
  },
  {
    img: "https://cdn.discordapp.com/attachments/877643868007510272/877643897971959828/unknown.png",
    nickName: "private",
    name: "Pedago",
  },
  {
    img: "https://cdn.discordapp.com/attachments/877643868007510272/877643897971959828/unknown.png",
    nickName: "private",
    name: "Pedago",
  },
  {
    img: "https://cdn.discordapp.com/attachments/877643868007510272/877643897971959828/unknown.png",
    nickName: "private",
    name: "Pedago",
  },
  {
    img: "https://cdn.discordapp.com/attachments/877643868007510272/877643897971959828/unknown.png",
    nickName: "private",
    name: "Pedago",
  },
];
export default MiddleComponent;
