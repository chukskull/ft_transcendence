import { Avatar } from "@nextui-org/react";
import React from "react";
import Modal from "react-modal";
import UserMenu from "@/components/SPA/chat/UserMenu";
import style from "@/styles/SPA/chat/chat.module.scss";
import { ProtectedModal } from "@/components/global/ChannelPass";
import axios from "axios";
import { useMediaQuery } from "@mantine/hooks";
import { last } from "lodash";
import { useQuery } from "react-query";

interface ProfileCompProps {
  id?: number;
  img: string;
  nickName?: string;
  firstName: string;
  lastName?: string;
  color?: string;
  type?: "Protected" | "Public" | "achiv" | null;
  inChannel?: boolean;
  channelId?: number;
}

const ProfileComp = ({
  id,
  img,
  nickName,
  firstName,
  lastName,
  type,
  color,
  inChannel,
  channelId,
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
  const isTabletOrMobile = useMediaQuery("(max-width: 1222px)"); // Adjust the max-width value for tablet and mobile screens

  const handleModalClick = () => {
    if (type === "Protected") {
      setShow(true);
    } else if (type === "Public") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channelId}/join`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    } else if (type === "achiv") {
      setShow(false);
    } else {
      setShow(true);
    }
  };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;
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
            data.nickName !== nickName && (
              <UserMenu
                id={id}
                channel={inChannel}
                avatarUrl={img}
                nickName={nickName}
              />
            )
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
          isBordered
          color="success"
          src={img}
          size={isTabletOrMobile ? "md" : "md"}
        />
        <div className="m-0 p-0">
          {/* Truncate long names and nicknames */}
          <h4
            className={`text-white font-ClashGrotesk-Medium text-base m-0 p-0 ${
              isTabletOrMobile ? "sm:text-sm" : ""
            }`}
          >
            {lastName && firstName.length + lastName.length > 15
              ? `${firstName.slice(0, 5)}...${lastName?.slice(0, 5)} `
              : `${firstName} ${lastName} `}
          </h4>
          <h6
            className={`text-white font-ClashGrotesk-Regular text-sm opacity-50 m-0 p-0 ${
              isTabletOrMobile ? "sm:text-sm" : ""
            }`}
          >
            {nickName ? "#" : ""}
            {nickName && nickName.length > 10
              ? `${nickName.slice(0, 7)}...`
              : nickName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
