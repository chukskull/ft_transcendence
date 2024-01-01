"use client";

import { Badge, DropdownSection, badge } from "@nextui-org/react";
import React, { use, useEffect, useState } from "react";
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
  const [socket, setSocket] = useState<any>(null);
  const [PVPrequest, setReceivedDatarequest] = useState<any>(null);
  const router = useRouter();
  const [receivedData, setReceivedData] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const handleClick = () => {
    setNotifCount(0);
  };

  const newAchivQuery = useQuery(
    "newAchiv",
    async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`,
        { withCredentials: true }
      );
      setUserProfile(response.data);
      return response.data.achievements;
    },
    {
      refetchInterval: 500,
    }
  );
  useEffect(() => {
    if (newAchivQuery.data) {
      setReceivedData((prev: any) => [...prev, ...newAchivQuery.data]);
      console.log("newAchivQuery.data", newAchivQuery.data);
    }
  }, [newAchivQuery.data]);

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
      setReceivedData((prev: any) => [
        ...prev,
        ...pendingFriendRequestsQuery.data,
      ]);
    }
  }, [pendingFriendRequestsQuery.data, setReceivedData]);

  // useEffect(() => {
  //   setNotifCount(receivedData.length);
  // }, [receivedData]);

  useEffect(() => {
    if (PVPrequest) {
      setReceivedData((prev: any[]) => [...prev, PVPrequest]);
      setNotifCount((prev: any) => prev + 1);
    }
  }, [PVPrequest, setReceivedData]);

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

  useEffect(() => {
    if (!socket) return;
    socket.on("newPVPRequest", (data: any) => setReceivedDatarequest(data));
    socket.on("newAchievement", () => {
      setNotifCount((prev: any) => prev + 1);
    });
    // socket.on("notAuth", () => {
    //   console.log("notAuth");
    //   router.push("/login");
    // });
    return () => {
      socket.off("newPVPRequest");
      socket.off("notAuth");
    };
  }, [socket]);

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
          setReceivedData((prev: any) =>
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
          setReceivedData((prev: any) =>
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

  const handlePVPRequest = (PvPnotifId: string, type: number) => {
    // 1 acceptPVP 0 declinePVP
    setReceivedData((prev: any) =>
      prev.filter((notif: any) => notif.id !== PvPnotifId)
    );
    if (type == 1 && PvPnotifId && userProfile.status != "inGame") {
      if (window.location.pathname == "/game") {
        window.location.href = `/game?accept?notifId=${PvPnotifId}`;
      } else {
        router.push(`/game?accept?notifId=${PvPnotifId}`);
      }
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
        onClose={() => setReceivedData([])}
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
            aria-label="Dynamic Actions"
          >
            {receivedData?.reverse().map((notif: any, index) =>
              notif?.icon ? (
                <DropdownItem key={index}>
                  <div className="flex flex-col  gap-1 p-1">
                    <div className="flex flex-row gap-4 items-center ">
                      <Avatar src={notif?.icon} size={"large"} />
                      <h6 className="text-base font-ClashGrotesk-Regular text-fontlight py-1">
                        {`Congratulations ! ${notif?.description}`}
                      </h6>
                    </div>
                  </div>
                </DropdownItem>
              ) : notif?.inviter ? (
                <DropdownItem key={index}>
                  <div className="flex flex-col gap-1 p-1">
                    <div className="flex gap-2" key={index}>
                      <ProfileComp
                        key={index}
                        id={index}
                        img={notif?.inviter.avatarUrl}
                        firstName={notif?.inviter.firstName}
                        lastName={notif?.inviter.lastName}
                        invite={"sent you a game request"}
                        status={notif?.inviter.status}
                      />
                    </div>
                    <div
                      className="flex flex-row gap-1 justify-end"
                      key={index}
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
              ) : (
                <DropdownItem key={index}>
                  <div className="flex flex-col gap-1 p-1">
                    <div className="flex gap-2" key={index}>
                      <ProfileComp
                        key={index}
                        id={index}
                        img={notif?.avatarUrl}
                        firstName={notif?.firstName}
                        lastName={notif?.lastName}
                        invite={"sent you a friend request"}
                        status={notif?.status}
                      />
                    </div>
                    <div
                      className="flex flex-row gap-1 justify-end"
                      key={index}
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

// {
//   Achiv?.map((notif: any) => (
//     <DropdownItem key={index}>
//       <div className="flex flex-col  gap-1 p-1">
//         <div className="flex flex-row gap-4 items-center ">
//           <Avatar src={notif?.icon} size={"large"} />
//           <h6 className="text-base font-ClashGrotesk-Regular text-fontlight py-1">
//             {`Congratulations ! ${notif?.description}`}
//           </h6>
//         </div>
//       </div>
//     </DropdownItem>
//   ));
// }
// {
//   Pvp?.map(
//     (notif: any) =>
//       notif.accepted == false &&
//       notif.declined == false && (
//         <DropdownItem key={notif?.id}>
//           <div className="flex flex-col gap-1 p-1">
//             <div className="flex gap-2" key={notif?.id}>
//               <ProfileComp
//                 key={notif?.id}
//                 id={notif?.id}
//                 img={notif?.inviter.avatarUrl}
//                 firstName={notif?.inviter.firstName}
//                 lastName={notif?.inviter.lastName}
//                 invite={"sent you a game request"}
//                 status={notif?.inviter.status}
//               />
//             </div>
//             <div className="flex flex-row gap-1 justify-end" key={notif?.id}>
//               <Button
//                 size="sm"
//                 color="success"
//                 onPress={() => {
//                   handlePVPRequest(notif?.id, 1);
//                 }}
//               >
//                 Accept
//               </Button>
//               <Button
//                 size="sm"
//                 color="danger"
//                 onPress={() => {
//                   handlePVPRequest(notif?.id, 0);
//                 }}
//               >
//                 Decline
//               </Button>
//             </div>
//           </div>
//         </DropdownItem>
//       )
//   );
// }
// {
//   Pending?.map((notif: any) => (
//     <DropdownItem key={notif?.id}>
//       <div className="flex flex-col gap-1 p-1">
//         <div className="flex gap-2" key={notif?.id}>
//           <ProfileComp
//             key={notif?.id}
//             id={notif?.id}
//             img={notif?.avatarUrl}
//             firstName={notif?.firstName}
//             lastName={notif?.lastName}
//             invite={"sent you a friend request"}
//             status={notif?.status}
//           />
//         </div>
//         <div className="flex flex-row gap-1 justify-end" key={notif?.id}>
//           <Button
//             size="sm"
//             color="success"
//             onPress={() => {
//               handleAcceptReq(notif?.id, 1);
//             }}
//           >
//             Accept
//           </Button>
//           <Button
//             size="sm"
//             color="danger"
//             onPress={() => {
//               handleDeclineReq(notif?.id, 1);
//             }}
//           >
//             Decline
//           </Button>
//         </div>
//       </div>
//     </DropdownItem>
//   ));
// }
