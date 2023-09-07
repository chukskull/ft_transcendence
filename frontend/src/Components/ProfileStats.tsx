import React from "react";
import style from "../styles/ProfileComponents.module.scss";

interface StatProps {
  statName: string;
  statValue: string;
}

const StatItem: React.FC<StatProps> = ({ statName, statValue }) => {
  return (
    <div className={style.statItem}>
      <span className={style.statName}>{statName} :</span>
      <span className={style.statValue}>{statValue}</span>
    </div>
  );
};

const ProfileStats: React.FC = () => {
  return (
    <div className={style.stats}>
      <h2>Stats</h2>
      <div className={style.statsList}>
        <StatItem statName="Matches Played" statValue="10" />
        <StatItem statName="Victories" statValue="7" />
        <StatItem statName="Defeats" statValue="3" />
        <StatItem statName="Win Rate" statValue="70%" />
      </div>
      <div className={style.trophies}>
        <div className={style.trophy}>
          <img src="https://img.freepik.com/free-vector/trophy_78370-345.jpg?w=740&t=st=1684727556~exp=1684728156~hmac=6ec6dbade5fe4fb2fcf35cb96f6bc0989c7cbbe9a938a3f4e426e25956b9f513" />
          <span>Congratulations! You are a champion!</span>
        </div>
        <div className={style.trophy}>
          <img src="https://img.freepik.com/free-vector/trophy_78370-345.jpg?w=740&t=st=1684727556~exp=1684728156~hmac=6ec6dbade5fe4fb2fcf35cb96f6bc0989c7cbbe9a938a3f4e426e25956b9f513" />
          <span>Congratulations! You are a champion!</span>
        </div>
        <div className={style.trophy}>
          <img src="https://img.freepik.com/free-vector/trophy_78370-345.jpg?w=740&t=st=1684727556~exp=1684728156~hmac=6ec6dbade5fe4fb2fcf35cb96f6bc0989c7cbbe9a938a3f4e426e25956b9f513" />
          <span>Congratulations! You are a champion!</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
