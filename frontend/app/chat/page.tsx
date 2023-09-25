import style from "../../styles/Chat/chat.module.scss";
import Image from "next/image";
import TopLeftNav from "@/components/global/TopLeftNav";
import "@/styles/globals.css";

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
];

const DmBlock = ({ dm }: { dm: any }) => {
  return (
    <div className={style["dm-item"]} key={dm.name}>
      <div className={style["dm-avatar"]}>
        <Image
          src={dm.avatar}
          alt="avatar"
          width={0}
          height={0}
          className={style["avatar"]}
        />
        {dm.online && <div className={style["online"]}></div>}
      </div>
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
          <DmBlock dm={dm} key={dm.name} />
        ))}
      </div>
    </div>
  );
};

export default function Chat() {
  return (
    <main>
      <TopLeftNav />
      <div className={style["chat-container"]}>
        <div className={style["menu-sections"]}>
          <ChannelsSection />
          <DmSection />
        </div>
        <div className={style["chat-box"]}>
          <div className={style["chat-header"]}></div>
        </div>
      </div>
    </main>
  );
}
