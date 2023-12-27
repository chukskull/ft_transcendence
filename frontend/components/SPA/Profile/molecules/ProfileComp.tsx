import { Avatar } from "@nextui-org/react";
import React, { useEffect } from "react";
import Modal from "react-modal";
import UserMenu from "@/components/SPA/chat/UserMenu";
import style from "@/styles/SPA/chat/chat.module.scss";
import { ProtectedModal } from "@/components/global/ChannelPass";
import axios from "axios";
import { useQuery } from "react-query";
import { stat } from "fs";

interface ProfileCompProps {
  id?: number;
  img: string;
  nickName?: string;
  firstName: string;
  lastName?: string;
  type?: "Protected" | "Public" | "achiv" | null;
  status?: string;
  inChannel?: boolean;
  channelId?: number;
  isMod?: boolean;
  invite?: string;
}

const ProfileComp = ({
  id,
  img,
  nickName,
  firstName,
  lastName,
  type,
  status,
  inChannel,
  channelId,
  isMod,
  invite,
}: ProfileCompProps) => {
  const { isLoading, data, error } = useQuery("getSession", async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/me`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  });

  const [showModal, setShow] = React.useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = React.useState(false);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setIsTabletOrMobile(true);
      } else {
        setIsTabletOrMobile(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  type StatusType =
    | "success"
    | "warning"
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | undefined;

  const getActivityStatus = (status: string | undefined): StatusType => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "danger";
      case "ingame":
        return "warning";
      default:
        return "default";
    }
  };

  const handleModalClick = () => {
    if (type === "Protected") {
      setShow(true);
    } else if (type === "Public") {
      console.log("public");
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channelId}/join`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          document.location.reload();
        })
        .catch((err) => {
          console.log(err);
          //alert(err);
        });
    } else if (
      type === "achiv" ||
      data?.nickName.toLowerCase() === nickName?.toLocaleLowerCase()
    ) {
      setShow(false);
    } else {
      setShow(true);
    }
  };
  if (lastName === undefined) lastName = "";

  return (
    <div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShow(false)}
        overlayClassName={style["modal-overlay"]}
        className={style["user-menu-modal"]}
      >
        {showModal &&
          (type === "Protected" ? (
            <ProtectedModal channelId={channelId} />
          ) : (
            <UserMenu
              id={id}
              channel={inChannel}
              avatarUrl={img}
              chann={channelId}
              nickName={nickName}
              isMod={isMod}
              onAction={setShow}
            />
          ))}
      </Modal>

      <div
        className={`flex items-start justify-start gap-5 ${
          isTabletOrMobile ? "sm:gap-3" : ""
        }`}
        onClick={handleModalClick}
      >
        {/* Use size="sm" for tablets and mobiles */}
        <Avatar
          className="cursor-pointer"
          isBordered={status ? true : false}
          color={getActivityStatus(status)}
          src={img}
          size={isTabletOrMobile ? "sm" : "md"}
        />
        <div className="m-0 p-0">
          {/* Truncate long names and nicknames */}
          <h4
            className={`text-fontlight font-ClashGrotesk-Medium text-base m-0 p-0 truncate${
              isTabletOrMobile ? "sm:text-sm" : ""
            }`}
          >
            {lastName.length !== 0 && firstName.length + lastName.length > 15
              ? `${firstName.slice(0, 12)}...${lastName?.slice(0, 5)}`
              : `${firstName} ${lastName}`}
          </h4>
          <h6
            className={`text-fontlight font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0 ${
              isTabletOrMobile ? "sm:text-xs" : ""
            }`}
          >
            {invite && !nickName ? invite : "#"}

            {nickName && nickName.length > 10
              ? `${nickName.slice(0, 12)}...`
              : nickName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
