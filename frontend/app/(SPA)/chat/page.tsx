import style from "@/styles/SPA/chat/chat.module.scss";
import Image from "next/image";
import "@/styles/globals.scss";
import { FiLogOut } from "react-icons/fi";
interface DMboxProps {
  name: string;
  online: boolean;
  lastMsg: string;
  lastMsgTime: string;
  avatar: string;
}

interface avatarBubbleProps {
  avatar: string;
  online: boolean;
}

interface chatHeaderProps {
  avatar: string;
  name: string;
  group: boolean;
  online: boolean;
}

const dmList = [
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "02:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: false,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "11:00 AM",
    avatar: "/assets/components/Profile.svg",
  },
  {
    name: "John Doe",
    online: true,
    lastMsg: "Hey, how are you?",
    lastMsgTime: "12:00 PM",
    avatar: "/assets/components/Profile.svg",
  },
];

const AvatarBubble = (avatarBubbleProps: avatarBubbleProps) => {
  return (
    <div className={style["avatar-bubble"]}>
      <Image
        src={avatarBubbleProps.avatar}
        alt="avatar"
        width={0}
        height={0}
        className={style["avatar"]}
      />
      {avatarBubbleProps.online && <div className={style["online"]}></div>}
    </div>
  );
};

const DMbox = ({ dm }: { dm: DMboxProps }) => {
  return (
    <div className={style["dm-item"]} key={dm.name}>
      <AvatarBubble avatar={dm.avatar} online={dm.online} />
      <div className={style["dm-info"]}>
        <div className={style["dm-name"]}>{dm.name}</div>
        <div className={style["dm-last-msg"]}>{dm.lastMsg}</div>
      </div>
      <div className={style["dm-time"]}>{dm.lastMsgTime}</div>
    </div>
  );
};

const ChannelsSection = () => {
  const channelList = [
    {
      name: "#General",
      type: "public",
    },
    {
      name: "#Random",
      type: "public",
    },
    {
      name: "#Pedago",
      type: "public",
    },
    {
      name: "#WatchRoom",
      type: "private",
    },
    {
      name: "#GameRoom",
      type: "private",
    },
    {
      name: "#SecretRoom",
      type: "protected",
    },
  ];

  const groupedChannels = channelList.reduce((acc, channel): any => {
    if (!acc[channel.type]) {
      acc[channel.type] = [];
    }
    acc[channel.type].push(channel);
    return acc;
  }, {});

  return (
    <div className={style["channels"]}>
      <div className={style["section-header"]}>
        <h2>CHANNELS</h2>
        <button className={style["add-btn"]}>+</button>
      </div>
      <div className={style["channel-categories"]}>
        {Object.keys(groupedChannels).map((category) => (
          <div key={category}>
            <h3>
              {category === "public"
                ? "Public Channels"
                : category === "private"
                ? "Private Channels"
                : "Protected Channels"}
            </h3>
            {groupedChannels[category].map((channel) => (
              <div className={style["channel-item"]} key={channel.name}>
                {channel.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const DmSection = () => {
  return (
    <div className={style["direct-msgs"]}>
      <div className={style["section-header"]}>
        <h2>DIRECT MESSAGES</h2>
        <button className={style["add-btn"]}>+</button>
      </div>
      <div className={style["dm-list"]}>
        {dmList.map((dm) => (
          <DMbox dm={dm} key={dm.name} />
        ))}
      </div>
    </div>
  );
};

const ChatHeader = (chatHeaderProps: chatHeaderProps) => {
  return (
    <div className={style["chat-header"]}>
      <div className={style["chat-user-group"]}>
        {!chatHeaderProps.group && (
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
        )}
        <div className={style["name"]}>{chatHeaderProps.name}</div>
        <Image
          src="/assets/components/ArrowDown.svg"
          alt="arrow"
          width={12}
          height={8}
          className={style["arrow-down"]}
        />
      </div>
      {chatHeaderProps.group && <FiLogOut className={style["leave-group"]} />}
    </div>
  );
};

export default function Chat() {
  return (
    <>
      <div className={style["chat-container"]}>
        <div className={style["menu-sections"]}>
          <ChannelsSection />
          <DmSection />
        </div>
        <div className={style["chat-box"]}>
          <ChatHeader group={true} name="#lacastiekho" online avatar="" />
        </div>
      </div>
    </>
  );
}
