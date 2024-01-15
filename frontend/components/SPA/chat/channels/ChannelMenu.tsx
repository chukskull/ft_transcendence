import style from "@/styles/SPA/chat/chat.module.scss";
import { AiOutlineUserAdd } from "react-icons/ai";
import ProfileComp from "@/components/SPA/Profile/molecules/ProfileComp";
import { useEffect, useState } from "react";
import InFosPlayer from "../../Profile/atoms/InFosPlayer";
import ChannelSettings from "./ChannelSettings";
import axios from "axios";
import { useQuery } from "react-query";

const InviteSection = ({ chandId, onAction }: any) => {
  const [friends, setFriends] = useState<any>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`, {
        withCredentials: true,
      })
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => console.log(err));
  }, []);
  const inviteFriendToChannel = (id: number) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${chandId}/invite/${id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        onAction(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={style["invite-section"]}>
      <h1>
        <AiOutlineUserAdd />
        Invite Friends
      </h1>
      <input
        type="text"
        placeholder="Type the username to search for a friend"
      />

      <div className={style["invite-list"]}>
        {friends.map((e: any, index: number) => (
          <div key={index} className={style["friend"]}>
            <ProfileComp
              key={e.id}
              id={e.id}
              img={e.avatarUrl}
              nickName={e.nickName}
              firstName={e.firstName}
              lastName={e.lastName}
              channelId={e.id}
              status={e.status}
            />
            <button
              onClick={() => {
                inviteFriendToChannel(e.id);
              }}
            >
              <AiOutlineUserAdd />
              ADD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthoritySection = ({ owner, mods, chanID }: any) => {
  return (
    <div className={style["authority-section"]}>
      <h2>Owners</h2>
      <ProfileComp
        id={owner?.id}
        img={owner?.avatarUrl}
        nickName={owner?.nickName}
        firstName={owner?.firstName}
        lastName={owner?.lastName}
        inChannel={true}
        channelId={chanID}
        status={owner?.status}
        isMod={true}
      />
      <h2>Moderators</h2>
      <div className={style["list"]}>
        {mods?.map((e: any) => (
          <ProfileComp
            key={e.id}
            id={e.id}
            img={e.avatarUrl}
            nickName={e.nickName}
            firstName={e.firstName}
            lastName={e.lastName}
            inChannel={true}
            channelId={chanID}
            isMod={true}
            status={e.status}
          />
        ))}
      </div>
    </div>
  );
};

const MembersSection = ({ members, channelId }: any) => {
  return (
    <div className={style["members-section"]}>
      <h2>Members</h2>
      <div className={style["members-list"]}>
        {members?.map((e: any) => (
          <div className={style["member"]} key={e?.id}>
            <ProfileComp
              key={e?.id}
              id={e?.id}
              img={e?.avatarUrl}
              nickName={e?.nickName}
              firstName={e?.firstName}
              lastName={e?.lastName}
              inChannel={true}
              channelId={channelId}
              status={e?.status}
            />
          </div>
        ))}
      </div>
      <div className={style["total"]}>Total: {members?.length}</div>
    </div>
  );
};

const ChannelMenu = ({ channel, currentUser, onAction }: any) => {
  const [activeSection, setActiveSection] = useState<string>("Invite");
  const [active, setActive] = useState(0);
  const [channelData, setChannelData] = useState<any>(null);

  const isModOrOwner = () => {
    if (currentUser?.id === channel.owner.id) return true;
    if (channel.Moderators) {
      for (let i = 0; i < channel.Moderators.length; i++) {
        if (currentUser?.id === channel.Moderators[i].id) return true;
      }
    }
    return false;
  };
  const isMod = isModOrOwner();
  const handleButtonClick = (sectionName: string) => {
    setActiveSection(sectionName);
  };
  function handleActive(index: number) {
    setActive(index);
  }
  const {
    data: channelDatas,
    isLoading,
    isError,
    refetch,
  } = useQuery(["channel", channel.id], async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channel.id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  });
  useEffect(() => {
    if (channelDatas) setChannelData(channelDatas);
  }, [channelDatas]);

  return (
    <>
      <div className={style["menu-header"]}>
        <h1>{channel.name}</h1>
        <div className={style["menu-list"]}>
          {OptionsSections.map((e, i) =>
            !isMod && e.name == "Settings" ? null : (
              <InFosPlayer
                key={i}
                text={e.name}
                active={active === i}
                whenClick={() => {
                  handleActive(i);
                  handleButtonClick(e.name);
                }}
                isItprofile={false}
              />
            )
          )}
        </div>
      </div>
      <div className={style["menu-body"]}>
        {activeSection === "Invite" && (
          <InviteSection onAction={onAction} chandId={channel?.id} />
        )}
        {activeSection === "Authority Hub" && (
          <AuthoritySection
            owner={channelData?.owner}
            mods={channelData?.Moderators}
            chanID={channelData?.id}
          />
        )}
        {activeSection === "Members" && (
          <MembersSection
            members={channelData?.members}
            channelId={channelData?.id}
          />
        )}
        {activeSection === "Settings" && isMod && (
          <ChannelSettings
            banned={channelData?.BannedUsers}
            muted={channelData?.MutedUsers}
            id={channel?.id}
            chPrivate={channelData?.is_private}
            onAction={onAction}
          />
        )}
      </div>
    </>
  );
};

const OptionsSections = [
  {
    name: "Invite",
  },
  {
    name: "Authority Hub",
  },
  {
    name: "Members",
  },
  {
    name: "Settings",
  },
];

export default ChannelMenu;
