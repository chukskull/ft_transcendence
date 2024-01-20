import style from "@/styles/SPA/chat/chat.module.scss";
import {
  FaUser,
  FaUserPlus,
  FaUserSlash,
  FaUserShield,
  FaVolumeMute,
  FaBan,
  FaWalking,
  FaCommentSlash,
  FaCompressAlt,
} from "react-icons/fa";
import { BsController, BsChatLeftText } from "react-icons/bs";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Avatar } from "@nextui-org/react";

interface UserMenuProps {
  id?: number;
  nickName?: string;
  avatarUrl?: string;
  channel?: boolean;
  online?: boolean;
  chann?: number;
  isMod?: boolean;
  onAction: (action: any) => any;
}

const UserMenu = ({
  id,
  nickName,
  avatarUrl,
  channel,
  online,
  chann,
  isMod,
  onAction,
}: UserMenuProps) => {
  const router = useRouter();
  const [userInfos, setUserInfos] = useState<any>();
  const {
    data: infos,
    isLoading,
    isError,
  } = useQuery("userFriends", async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  });

  useEffect(() => {
    if (infos) setUserInfos(infos);
  }, [infos]);

  const isUserBlocked = () => {
    if (!userInfos) return false;
    return userInfos.blockedUsers?.some((e: any) => e.id === id);
  };
  const isFriend = () => {
    if (!userInfos) return false;
    return userInfos.friends?.some((e: any) => e.id === id);
  };

  return (
    <>
      <div className={style["user-menu"]}>
        <div className={style["user-menu-modal"]}>
          <div className={style["user-info"]}>
            <Avatar src={avatarUrl} size="lg" />
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
            {!isUserBlocked() ? (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  router.push(`/game?inviteToGame=${id}`);
                }}
              >
                <BsController />
                Invite To A Game
              </div>
            ) : (
              <></>
            )}

            {!isUserBlocked() && (
              <>
                {isFriend() ? (
                  <div
                    className={style["menu-item"]}
                    onClick={() => {
                      axios
                        .get(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/removeFriend/${id}`,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((res) => {
                          onAction(false);
                          console.log(res);
                        })
                        .catch((err) => {
                          //alert(err.response.data.message);
                          console.log(err);
                        });
                      onAction(false);
                    }}
                  >
                    <FaUserSlash />
                    Remove Friend
                  </div>
                ) : (
                  <div
                    className={style["menu-item"]}
                    onClick={() => {
                      axios
                        .get(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/addFriend/${id}`,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((res) => {
                          onAction(false);
                          console.log(res);
                        })
                        .catch((err) => {
                          //alert(err.response.data.message);
                          console.log(err);
                        });
                    }}
                  >
                    <FaUserPlus />
                    Add Friend
                  </div>
                )}
              </>
            )}

            {!isUserBlocked() && (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  onAction(false);
                  router.push(`/chat/users/${nickName}`);
                }}
              >
                <BsChatLeftText />
                Message
              </div>
            )}
            {isUserBlocked() ? (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/0`,
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() => {
                      onAction(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <FaCompressAlt />
                Unblock
              </div>
            ) : (
              <div
                className={style["menu-item"]}
                onClick={() => {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/handleblock/${id}/1`,
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() => {
                      onAction(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <FaCommentSlash />
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
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/modding/${id}/mod`,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((res) => {
                          console.log(res);
                          onAction(false);
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
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chann}/modding/${id}/unmod`,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((res) => {
                          console.log(res);
                          onAction(false);
                        })
                        .catch((err) => {});
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
                        onAction(false);
                        console.log(res);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <FaVolumeMute />
                  Mute From Channel
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
                        onAction(false);
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
                        onAction(false);
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
        </div>
      </div>
    </>
  );
};

export default UserMenu;
