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
import { useRouter } from "next/navigation";
import { set } from "lodash";

export const NotificationComp = ({}) => {
  const [notifCount, setNotifCount] = useState<number>(0);
  const [Pending, setPending] = useState<any[]>([]);
  const [Pvp, setPvp] = useState<any[]>([]);
  const [Achiv, setAchiv] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [PVPrequest, setPVPrequest] = useState<any>(null);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  const router = useRouter();
  //  const [receivedData, setReceivedData] = useState<any>(null);
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
    },
    {
      refetchInterval: 500,
    }
  );

  useEffect(() => {
    if (pendingFriendRequestsQuery.data) {
      setPending(pendingFriendRequestsQuery.data);
      setNotifCount(pendingFriendRequestsQuery.data.length);
    }
  }, [pendingFriendRequestsQuery.data, Pending]);

  useEffect(() => {
    if (newAchievement) {
      setAchiv((prev: any) => [...prev, newAchievement]);
      setNotifCount((prev: any) => prev + 1);
    }
  }, [newAchievement]);
  useEffect(() => {
    console.log("new invitation occovoe icp requerst", PVPrequest);
    if (PVPrequest) {
      setPvp((prev: any) => [...prev, PVPrequest]);
      setNotifCount((prev: any) => prev + 1);
    }
  }, [PVPrequest]);
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
  socket.on("newPVPRequest", (data: any) => setPVPrequest(data));
  socket.on("newAchievement", (data: any) => setNewAchievement(data));
  const handleAcceptReq = (friendId: number, type: number) => {
    // 1 friendRequest 2 gameRequest
    if (type === 1) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/FriendRequest/${friendId}/1`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          setPending((prev: any) =>
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
          setPending((prev: any) =>
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

  const handlePVPRequest = (PvPnotifId: number, type: number) => {
    // 1 acceptPVP 0 declinePVP
    if (type == 1 && PvPnotifId) {
      router.push(`/game?accept?notifId=${PvPnotifId}`);
    } else if (type == 0) {
      const newSocket = io(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gameSockets`
      );
      newSocket.connect();
      newSocket.emit("declinePVP", {
        token: document.cookie.split("=")[1],
        notifId: PvPnotifId,
      });
    }
  };

  return (
    <>
      <Dropdown
        classNames={{
          content: "bg-black",
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
            {Achiv?.length > 0 &&
              Achiv?.map((notif: any) => (
                <DropdownItem key={notif?.id}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div className="flex flex-row gap-4 items-center ">
                      <Avatar src={notif?.icon} size={"large"} />
                      <h6 className="text-base font-ClashGrotesk-Regular text-fontlight py-1">
                        {`Congratulations ! ${notif?.description}`}
                      </h6>
                    </div>
                  </div>
                </DropdownItem>
              ))}
            {Pvp?.length > 0 &&
              Pvp?.map((notif: any) => (
                <DropdownItem key={notif?.id}>
                  <div className="flex flex-col gap-1 p-1">
                    <div className="flex gap-2" key={notif?.id}>
                      <ProfileComp
                        key={notif?.id}
                        id={notif?.id}
                        img={notif?.inviter.avatarUrl}
                        firstName={notif?.inviter.firstName}
                        lastName={notif?.inviter.lastName}
                        invite={"sent you a game request"}
                        status={notif?.inviter.status}
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
                          handlePVPRequest(notif?.id, 1);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onPress={() => {
                          handlePVPRequest(notif?.id, 0);
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </DropdownItem>
              ))}
            {Pending?.length > 0 &&
              Pending?.map((notif: any) => (
                <DropdownItem key={notif?.id}>
                  <div className="flex flex-col gap-1 p-1">
                    <div className="flex gap-2" key={notif?.id}>
                      <ProfileComp
                        key={notif?.id}
                        id={notif?.id}
                        img={notif?.avatarUrl}
                        firstName={notif?.firstName}
                        lastName={notif?.lastName}
                        invite={"sent you a friend request"}
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
              ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
