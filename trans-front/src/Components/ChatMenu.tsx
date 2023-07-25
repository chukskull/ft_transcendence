import React, { useState } from "react";
import styles from "../styles/ChatMenu.module.scss";

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

  const friends: Friend[] = [
    {
      id: 1,
      name: "John Doe",
      profilePicture: "path/to/john.jpg",
      blocked: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePicture: "path/to/jane.jpg",
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

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedFriend(null);
  };

  const handleAddFriend = () => {
    // Implement the logic to add a friend
  };

  const handleBlockFriend = (friend: Friend | null) => {
    // Implement the logic to block a friend
  };

  const handleAddFriendToChannel = (friend: Friend | null) => {
    // Implement the logic to add a friend to a channel
  };

  const handleKickMemberFromChannel = (friend: Friend | null) => {
    // Implement the logic to kick a member from a channel
  };

  return (
    <div className={styles["chat-menu"]}>
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
            <h2>Friends</h2>
            <button onClick={handleAddFriend}>Add Friend</button>
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
      {(selectedFriend || selectedChannel) && (
        <div className={styles["chat-popup"]}>
          {selectedFriend && (
            <>
              <img
                src={selectedFriend.profilePicture}
                alt={selectedFriend.name}
              />
              <h3>{selectedFriend.name}</h3>
              <button onClick={() => handleBlockFriend(selectedFriend)}>
                Block
              </button>
              {/* Implement chat messages here */}
            </>
          )}
          {selectedChannel && (
            <>
              <img src={selectedChannel.icon} alt={selectedChannel.name} />
              <h3>{selectedChannel.name}</h3>
              <button onClick={() => handleAddFriendToChannel(selectedFriend)}>
                Add Friend
              </button>
              <button
                onClick={() => handleKickMemberFromChannel(selectedFriend)}
              >
                Kick
              </button>
              {/* Implement chat messages for the channel here */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
