import React from "react";
import { Link } from "react-router-dom";
import style from "../styles/Navbar.module.scss";
import logo from "../assets/1337_white_logo.svg";
interface NavBarProps {
  userName: string;
  avatarUrl: string;
}

const NavBar: React.FC<NavBarProps> = ({ userName, avatarUrl }) => {
  return (
    <nav className={style.navbar}>
      <div className={style.logo}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={style.nav_links}>
        <Link to="/home">
          <img src={avatarUrl} alt="User Profile" />
          <span>{userName}</span>
        </Link>
        <Link to="/chat">Chat</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </nav>
  );
};

export default NavBar;
