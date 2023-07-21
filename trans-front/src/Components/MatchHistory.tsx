import React from "react";
import style from "../styles/ProfileComponents.module.scss";

interface Match {
  id: number;
  opponent: string;
  result: string;
  profilePicture: string;
}

const MatchHistory: React.FC = () => {
  const matchData: Match[] = [
    {
      id: 1,
      opponent: "Player A",
      result: "Win",
      profilePicture: "https://i.pravatar.cc/300",
    },
    {
      id: 2,
      opponent: "Player B",
      result: "Loss",
      profilePicture: "https://i.pravatar.cc/300",
    },
    {
      id: 3,
      opponent: "Player C",
      result: "Win",
      profilePicture: "https://i.pravatar.cc/300",
    },
  ];

  return (
    <div className={style.matchHistory}>
      <h2>Match History</h2>
      <div className={style.matchList}>
        {matchData.map((match) => (
          <div key={match.id} className={style.matchItem}>
            <div className={`${style.participant} ${style.currentUser}`}>
              <div className={style.profilePicture}>
                <img src={match.profilePicture} alt="Profile" />
              </div>
              <div
                className={`${style.matchDetails} ${
                  style[match.result.toLowerCase()]
                }`}
              >
                <span className={style.userName}>Mountassir</span>
              </div>
            </div>
            <div className={style.vs}>VS</div>
            <div className={`${style.participant} ${style.opponent}`}>
              <div className={style.profilePicture}>
                <img src={match.profilePicture} alt="Profile" />
              </div>
              <div
                className={`${style.matchDetails} ${
                  style[match.result.toLowerCase()]
                }`}
              >
                <span className={style.opponent}>{match.opponent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
