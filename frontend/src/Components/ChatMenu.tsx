import React, { useState } from "react";
import styles from "../styles/ChatMenu.module.scss";
import { FiSend } from "react-icons/fi";
import { NULL } from "sass";

interface Friend {
  id: number;
  name: string;
  profilePicture: string;
  blocked: boolean;
}

interface Channel {
  id: number;
  name: string;
  icon: string;
  members: Friend[];
}

const ChatMenu: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"friends" | "channels">(
    "friends"
  );
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [userMenu, setUserMenu] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const friends: Friend[] = [
    {
      id: 1,
      name: "John Doe",
      profilePicture: "https://i.pravatar.cc/300",
      blocked: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePicture: "https://i.pravatar.cc/300",
      blocked: true,
    },
    // Add more friends here
  ];

  const channels: Channel[] = [
    {
      id: 1,
      name: "Channel 1",
      icon: "path/to/channel1-icon.jpg",
      members: [friends[0]],
    },
    {
      id: 2,
      name: "Channel 2",
      icon: "path/to/channel2-icon.jpg",
      members: [friends[1]],
    },
    // Add more channels here
  ];
  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setSelectedChannel(null);
  };

  const handleSendMessage = () => {
    // Add the new message to the chatMessages state
    setChatMessages((prevMessages) => [...prevMessages, inputText]);

    // Clear the input text after sending the message
    setInputText("");
  };
  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedFriend(null);
  };

  const handleAddFriend = () => {};

  const handleBlockFriend = (friend: Friend | null) => {};

  const handleAddFriendToChannel = (friend: Friend | null) => {};

  const handleKickMemberFromChannel = (friend: Friend | null) => {};

  return (
    <>
      <div className={styles["chat-menu"]}>
        <div className={styles.menuTitle}>
          <h2>Chat</h2>
        </div>
        <div className={styles.line}></div>

        <div className={styles["section-toggle"]}>
          <button
            className={activeSection === "friends" ? styles.active : ""}
            onClick={() => setActiveSection("friends")}
          >
            Friends
          </button>
          <button
            className={activeSection === "channels" ? styles.active : ""}
            onClick={() => setActiveSection("channels")}
          >
            Channels
          </button>
        </div>

        <div className={styles.section}>
          {activeSection === "friends" && (
            <>
              <ul>
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    onClick={() => handleFriendClick(friend)}
                    className={friend.blocked ? styles.blocked : ""}
                  >
                    <img src={friend.profilePicture} alt={friend.name} />
                    <span>{friend.name}</span>
                    {friend.blocked && <span>(Blocked)</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
          {activeSection === "channels" && (
            <>
              <h2>Channels</h2>
              <ul>
                {channels.map((channel) => (
                  <li
                    key={channel.id}
                    onClick={() => handleChannelClick(channel)}
                  >
                    <img src={channel.icon} alt={channel.name} />
                    <span>{channel.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      {(selectedFriend || selectedChannel) && (
        <div className={styles.chatPopup}>
          <div className={styles.topBox}>
            <img src="https://i.pravatar.cc/300" />
            <h2>Mountassir</h2>
            <button>...</button>
            <button
              onClick={() => {
                setSelectedChannel(null);
                setSelectedFriend(null);
              }}
            >
              X
            </button>
          </div>
          <div className={styles.line}></div>
          <div className={styles.chatBox} />
          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={handleSendMessage}>
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMenu;
