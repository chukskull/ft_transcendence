import style from "@/styles/SPA/chat/chat.module.scss";
import {
  FaUser,
  FaUserPlus,
  FaUserSlash,
  FaUserShield,
  FaVolumeMute,
  FaBan,
  FaWalking,
} from "react-icons/fa";
import { BsController, BsChatLeftText } from "react-icons/bs";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserMenu = ({
  id,
  nickName,
  avatarUrl,
  channel,
  online,
  chann,
  isMod,
}: any) => {
  const router = useRouter();
  const [userInfos, setUserInfos] = useState<any>();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserInfos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const isUserBlocked = () => {
    if (!userInfos) return false;
    return userInfos.blockedUsers.some((e: any) => e.id === id);
  };
  const isFriend = () => {
    if (!userInfos) return false;
    return userInfos.friends.some((e: any) => e.id === id);
  };

  return (
    <>
      <div className={style["user-info"]}>
        <AvatarBubble avatar={avatarUrl} online={online} />
        <h2>{nickName}</h2>
      </div>
      <div className={style["menu"]}>
        <div
          className={style["menu-item"]}
          onClick={() => {
            router.push(`/profile/${nickName}`);
          }}
        >
          <FaUser />
          View Profile
        </div>
        <div
          className={style["menu-item"]}
          onClick={() => {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/invite/${id}`
              )
              .then((res) => {})
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <BsController />
          Invite To A Game
        </div>
        {isUserBlocked() && (
          <div
            className={style["menu-item"]}
            onClick={() => {
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/0`
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <FaUserSlash />
            Unblock
          </div>
        )}
        {isFriend() && (
          <div
            className={style["menu-item"]}
            onClick={() => {
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/removeFriend/${id}`
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <FaUserSlash />
            Remove Friend
          </div>
        )}

        <div
          className={style["menu-item"]}
          onClick={() => {
            router.push(
              `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/users/${nickName}`
            );
          }}
        >
          <BsChatLeftText />
          Message
        </div>
        {!isFriend() && (
          <div
            className={style["menu-item"]}
            onClick={() => {
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sendFriendRequest/${id}`
                )
                .then((res) => {})
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <FaUserPlus />
            Add Friend
          </div>
        )}
        {!isUserBlocked() && (
          <div
            className={style["menu-item"]}
            onClick={() => {
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/1`
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <FaUserSlash />
            Block
          </div>
        )}
        {channel && (
          <>
            {!isMod ? (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/modding/${id}/1`,
                      {
                        withCredentials: true,
                      }
                    )
                    .then((res) => {
                      console.log(res);
                      document.location.reload();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <FaUserShield />
                Make A Moderator
              </div>
            ) : (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/modding/${id}/0`,
                      {
                        withCredentials: true,
                      }
                    )
                    .then((res) => {
                      console.log(res);
                      document.location.reload();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <FaUserShield />
                Remove Moderator
              </div>
            )}

            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/muting/${id}/1`,
                    {
                      withCredentials: true,
                    }
                  )
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <FaVolumeMute />
              Mute
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/banning/${id}/1`,
                    {
                      withCredentials: true,
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    document.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <FaBan />
              Ban From Channel
            </div>
            <div
              className={style["menu-item"]}
              onClick={() => {
                axios
                  .get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/kickUser/${id}`,
                    {
                      withCredentials: true,
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    document.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <FaWalking />
              Kick From Channel
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserMenu;
