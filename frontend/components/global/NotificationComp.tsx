import { Badge, DropdownSection } from "@nextui-org/react";
import React from "react";
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

export const NotificationComp = () => {
  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "bg-black", // change arrow background
        }}
      >
        <DropdownTrigger>
          <div>
            <Badge content={69} color="danger">
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
              width: "400px",
              overflow: "auto",
              maxHeight: "400px",
              padding: "12px",
            }}
            title="Actions"
          >
            {users.map((user, index) => (
              <DropdownItem key={index}>
                <div className="flex flex-row gap-4" key={index}>
                  <ProfileComp
                    key={index}
                    img={user.img}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    nickName={user.nickName}
                  />
                  <h1>has invited to play a game</h1>
                </div>
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const users = [
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
];
