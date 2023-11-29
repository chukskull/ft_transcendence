import style from "@/styles/SPA/chat/chat.module.scss";
import { AiOutlineUserAdd } from "react-icons/ai";
import ProfileComp from "@/components/SPA/Profile/molecules/ProfileComp";
import { useEffect, useState } from "react";
import InFosPlayer from "../../Profile/atoms/InFosPlayer";
import ChannelSettings from "./ChannelSettings";
import axios from "axios";

const InviteSection = ({ chandId }: any) => {
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
        console.log(res.data);
        document.location.reload();
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
        {friends.map((e: any) => (
          <div className={style["friend"]}>
            <ProfileComp
              key={e.id}
              id={e.id}
              img={e.avatarUrl}
              nickName={e.nickName}
              firstName={e.firstName}
              lastName={e.lastName}
              channelId={e.id}
            />
            <button
              onClick={() => {
                inviteFriendToChannel(e.id);
              }}
            >
              <AiOutlineUserAdd />
              Invite
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
            channelId={e.id}
            isMod={true}
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
            />
          </div>
        ))}
      </div>
      <div className={style["total"]}>Total: {members?.length}</div>
    </div>
  );
};

const ChannelMenu = ({ channel, currentUser }: any) => {
  const [activeSection, setActiveSection] = useState<string>("Invite");
  const [active, setActive] = useState(0);
  const [channelData, setChannelData] = useState<any>(null);

  const isModOrOwner = () => {
    if (currentUser.id === channel.owner.id) return true;
    if (channel.Moderators) {
      for (let i = 0; i < channel.Moderators.length; i++) {
        if (currentUser.id === channel.Moderators[i].id) return true;
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
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${channel.id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setChannelData(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
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
        {activeSection === "Invite" && <InviteSection chandId={channel?.id} />}
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
            muted={channelData?.conversation.MutedUsers}
            id={channel?.id}
            chPrivate={channelData?.is_private}
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
