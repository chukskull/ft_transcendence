import React from "react";
import { User } from "../pages/Chat"; // Import the User type

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <img src={user.avatarUrl} alt="User Avatar" />

      <div className="user-info">
        <p>Email: </p>
        <p>Location: </p>
        {/* Add more user information as needed */}
      </div>

      <div className="match-history">
        <h3>Match History</h3>
        <ul>
          {/* {user.matchHistory.map((match, index) => (
            <li key={index}>
              <span>Opponent: {match.opponent}</span>
              <span>Result: {match.result}</span>
            </li>
          ))} */}
        </ul>
      </div>

      <div className="ranking">
        <h3>Ranking</h3>
        <p>Current Rank:</p>
        <p>Win/Loss Ratio:</p>
        {/* Add more ranking information as needed */}
      </div>

      <div className="status">
        <h3>Status</h3>
        <p></p>
      </div>
    </div>
  );
};

export default Profile;
