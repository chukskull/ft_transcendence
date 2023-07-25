import React, { useState } from "react";
import NavBar from "../Components/Navbar";
import style from "../styles/Chat.module.scss";
import Channels from "../Components/Channels";
import ChatBox from "../Components/ChatBox";
import Profile from "../Components/profile";

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface Channel {
  id: number;
  name: string;
}

interface UserMenuProps {
  onInvite: () => void;
  onBlock: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onInvite, onBlock }) => {
  return (
    <div className={style.userMenu}>
      <button className={style.btn} onClick={onInvite}>
        Invite to a game
      </button>
      <button className={style.btn} onClick={onBlock}>
        Block
      </button>
    </div>
  );
};

const User: React.FC<User & { setSelectedUser: (user: User | null) => void }> = ({ name, avatarUrl, id, setSelectedUser }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleInvite = () => {
    console.log("Invite user to a game");
    setShowMenu(false);
  };

  const handleBlock = () => {
    console.log("Block user");
    setShowMenu(false);
  };

  return (
    <div className={style.user} onClick={() => setSelectedUser({ id, name, avatarUrl })}>
      <div className={style.avatar}>
        <img src={avatarUrl} alt="User Avatar" />
        <div className={style.status} />
      </div>
      <div className={style.name}>
        <h3>{name}</h3>
      </div>
      <div className={style.menu}>
        <button className={style.btn} onClick={handleMenuClick}>
          ...
        </button>
        {showMenu && <UserMenu onInvite={handleInvite} onBlock={handleBlock} />}
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      avatarUrl: "https://i.pravatar.cc/300",
    },
    {
      id: 2,
      name: "Jane Doe",
      avatarUrl: "https://i.pravatar.cc/300",
    },
    {
      id: 3,
      name: "John Smith",
      avatarUrl: "https://i.pravatar.cc/300",
    },
    {
      id: 4,
      name: "Jane Smith",
      avatarUrl: "https://i.pravatar.cc/300",
    },
  ];

  const channels: Channel[] = [
    {
      id: 1,
      name: "General",
    },
    {
      id: 2,
      name: "Random",
    },
    {
      id: 3,
      name: "Tech",
    },
  ];
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <NavBar userName="John Doe" avatarUrl="https://i.pravatar.cc/300" />
      <div className={style.chatPage}>
        <div className={style.left}>
          <div className={style.users}>
            <h2>Users</h2>
            <div className={style.line} />
            {users.map((user) => (
              <User
                key={user.id}
                name={user.name}
                avatarUrl={user.avatarUrl}
                id={user.id}
                setSelectedUser={setSelectedUser}
              />
            ))}
          </div>
          <div className={style.channels}>
            <h2>Channels</h2>
            <div className={style.line} />
            {channels.map((channel) => (
              <Channels key={channel.id} name={channel.name} />
            ))}
          </div>
        </div>
        <div className={style.middle}>{selectedUser && <ChatBox />}</div>
        <div className={style.right}>
          {selectedUser && <Profile user={selectedUser} />}
        </div>
      </div>
    </>
  );
};

export default Chat;
