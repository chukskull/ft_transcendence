"use client";

import { Badge, DropdownSection, badge } from "@nextui-org/react";
import React, { use, useEffect } from "react";
import { NotificationIcon } from "./NotificationIcon";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from "@nextui-org/react";
import Profile from "@/app/(SPA)/profile/page";
import ProfileComp from "../SPA/Profile/molecules/ProfileComp";
import { Avatar } from "antd";

export const NotificationComp = ({}) => {
  const [notifCount, setNotifCount] = React.useState(data.length);

  const handleClick = () => {
    setNotifCount(0);
  };
  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "bg-black", // change arrow background
        }}
      >
        <DropdownTrigger onClick={handleClick}>
          <div>
            <Badge
              content={notifCount}
              isInvisible={notifCount === 0 ? true : false}
              color="danger"
            >
              <NotificationIcon width={25} height={25} />
            </Badge>
          </div>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-gray-700",
              "dark:data-[hover=true]:bg-gray-700",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-black-500",
            ],
          }}
        >
          <DropdownSection
            style={{
              width: "500px",
              overflow: "auto",
              maxHeight: "400px",
              padding: "20px",
            }}
            title="Actions"
          >
            {data.map((user, index) =>
              user.type === "Achievement" ? (
                <DropdownItem key={index}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div
                      className="flex flex-row gap-4 items-center "
                      key={index}
                    >
                      <Avatar src={user.img} size={"large"} />
                      <h6 className="text-base font-ClashGrotesk-Regular text-white py-1">
                        {`Congratulations ! ${user.description}`}
                      </h6>
                    </div>
                  </div>
                </DropdownItem>
              ) : (
                <DropdownItem key={index}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div className="flex gap-2 " key={index}>
                      <ProfileComp
                        key={index}
                        img={user.img}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        nickName="has invited you to play a game"
                      />
                    </div>
                    <div className="flex flex-row gap-1 justify-end">
                      <Button size="sm" color="success">
                        {" "}
                        Accept
                      </Button>
                      <Button size="sm" color="danger">
                        {" "}
                        Decline{" "}
                      </Button>
                    </div>
                  </div>
                </DropdownItem>
              )
            )}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const data = [
  {
    id: 0,
    img: "https://i.pravatar.cc/300?img=0",
    firstName: "Gold Level",
    description: "You have reached the gold level",
    type: "Achievement",
  },

  {
    id: 1,
    img: "https://i.pravatar.cc/300?img=1",
    nickName: "blonde",
    firstName: "Hajar",
    lastName: "blondy",
  },
  {
    id: 2,
    img: "https://i.pravatar.cc/300?img=2",
    nickName: "lemntsr",
    firstName: "mountassir",
    lastName: "fat",
  },
  {
    id: 3,
    img: "https://i.pravatar.cc/300?img=3",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    id: 4,
    img: "https://i.pravatar.cc/300?img=4",
    nickName: "CuriousCheetah",
    firstName: "William",
    lastName: "Davis",
  },
  {
    id: 5,
    img: "https://i.pravatar.cc/300?img=5",
    nickName: "TechTitan",
    firstName: "Emily",
    lastName: "Johnson",
  },
  {
    id: 6,
    img: "https://i.pravatar.cc/300?img=6",
    nickName: "CodingQueen",
    firstName: "Hannah",
    lastName: "Miller",
  },
  {
    id: 7,
    img: "https://i.pravatar.cc/300?img=7",
    nickName: "PixelMaster",
    firstName: "Jacob",
    lastName: "Taylor",
  },
  {
    id: 8,
    img: "https://i.pravatar.cc/300?img=8",
    nickName: "DesignDiva",
    firstName: "Olivia",
    lastName: "Moore",
  },
  {
    id: 9,
    img: "https://i.pravatar.cc/300?img=9",
    nickName: "GadgetGuru",
    firstName: "Mason",
    lastName: "Smith",
  },
  {
    id: 10,
    img: "https://i.pravatar.cc/300?img=0",
    firstName: "Gold Level",
    description: "You have reached the gold level",
    type: "Achievement",
  },
];
