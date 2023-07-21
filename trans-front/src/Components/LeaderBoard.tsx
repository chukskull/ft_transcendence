import React from "react";
import style from "../styles/ProfileComponents.module.scss";

interface Player {
  id: number;
  username: string;
  score: number;
  avatar: string;
}

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  return (
    <div className={style.leaderboard_container}>
      <h2>Leaderboard</h2>
      <table className={style.leaderboard_table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                <img src={player.avatar} />
              </td>
              <td>{player.username}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
