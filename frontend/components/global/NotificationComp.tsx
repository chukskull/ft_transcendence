"use client";

import { Badge, DropdownSection, badge } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { NotificationIcon } from "./NotificationIcon";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import ProfileComp from "../SPA/Profile/molecules/ProfileComp";
import { Avatar } from "antd";
import axios from "axios";
import { useQuery } from "react-query";
import io from "socket.io-client";

export const NotificationComp = ({}) => {
  const [notifCount, setNotifCount] = useState<number>(0);
  const [notifData, setNotifData] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [receivedData, setReceivedData] = useState<any>(null);
  const handleClick = () => {
    setNotifCount(0);
  };

  const pendingFriendRequestsQuery = useQuery(
    "pendingFriendRequests",
    async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`,
        { withCredentials: true }
      );
      return response.data.pendingFriendRequests;
    }
  );
  useEffect(() => {
    if (receivedData) {
      setNotifData((prev: any) => [...prev, receivedData]);
      setNotifCount((prev: any) => prev + 1);
      console.log("newPVPRequest", receivedData);
    }
  }, [receivedData]);
  useEffect(() => {
    if (pendingFriendRequestsQuery.data) {
      setNotifData(pendingFriendRequestsQuery.data);
      setNotifCount(pendingFriendRequestsQuery.data.length);
    }
  }, [pendingFriendRequestsQuery.data]);
  useEffect(() => {
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
      {
        query: {
          token: document.cookie.split("=")[1],
        },
      }
    );
    newSocket.connect();
    setSocket(newSocket);
  }, []);
  if (!socket) return;
  socket.on("newPVPRequest", (data: any) => setReceivedData(data));
  const handleAcceptReq = (friendId: number, type: number) => {
    // 1 friendRequest 2 gameRequest
    if (type === 1) {
      console.log("friendId", friendId);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/FriendRequest/${friendId}/1`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          setNotifData((prev: any) =>
            prev.filter((notif: any) => notif.id !== friendId)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDeclineReq = (friendId: number, type: number) => {
    // 1 friendRequest 2 gameRequest
    if (type === 1) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/FriendRequest/${friendId}/0`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setNotifData((prev: any) =>
            prev.filter((notif: any) => notif.id !== friendId)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  if (pendingFriendRequestsQuery.isLoading)
    return <NotificationIcon width={25} height={25} />;
  if (pendingFriendRequestsQuery.error) return <div>error</div>;

  const handlePVPRequest = (friendId: number, type: number) => {
    // 1 acceptPVP 0 declinePVP
    if (type == 1) {
      socket.emit("acceptPVP", { 
        token: document.cookie.split("=")[1],
        friendId });
    } else if (type == 0) {
      socket.emit("declinePVP", {
        token: document.cookie.split("=")[1],
        friendId
      });
    }
  }
  
  socket.on('newAchievement', (data: any) => {
    console.log(data);
  })

  return (
    <>
      <Dropdown
        classNames={{
          content: "bg-black", // change arrow background
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
            {notifData?.map((notif: any) =>
              notif.icon ? (
                <DropdownItem key={notif.id}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div className="flex flex-row gap-4 items-center ">
                      <Avatar src={notif?.icon} size={"large"} />
                      <h6 className="text-base font-ClashGrotesk-Regular text-fontlight py-1">
                        {`Congratulations ! ${notif?.description}`}
                      </h6>
                    </div>
                  </div>
                </DropdownItem>
              ) : (
                <DropdownItem key={notif.id}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div className="flex gap-2 " key={notif?.id}>
                      <ProfileComp
                        key={notif?.id}
                        id={notif?.id}
                        img={notif?.avatarUrl}
                        firstName={notif?.firstName}
                        lastName={notif?.lastName}
                        nickName={notif?.nickName}
                        status={notif?.status}
                      />
                    </div>
                    <div
                      className="flex flex-row gap-1 justify-end"
                      key={notif?.id}
                    >
                      <Button
                        size="sm"
                        color="success"
                        onPress={() => {
                          handleAcceptReq(notif?.id, 1);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onPress={() => {
                          handleDeclineReq(notif?.id, 1);
                        }}
                      >
                        Decline
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
