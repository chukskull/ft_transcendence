import React, { useState } from "react";
import NavBar from "../Components/Navbar";
import "../styles/Settings.scss";

const Settings: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [google2faCode, setGoogle2faCode] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Perform form submission logic here
    // You can access the form values using the state variables
  };

  const handleGoogle2faSetup = () => {
    const secretKey = "RANDOMSECRETKEY123";

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      `otpauth://totp/MyApp:${userName}?secret=${secretKey}&issuer=MyApp`
    )}`;
    console.log("QR Code URL:", qrCodeUrl);
    console.log("Secret Key:", secretKey);
  };
  return (
    <>
      <NavBar userName="John Doe" avatarUrl="https://i.pravatar.cc/300" />
      <div className="settingsPage">
        <h1>Settings</h1>
        <form className="container" onSubmit={handleSubmit}>
          <div className="info">
            <div className="avatar">
              <img src="https://i.pravatar.cc/300" alt="avatar" />
              <input type="file" name="avatar" id="avatar" />
            </div>
            <div className="userName">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="name">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="password">
              <label htmlFor="currPassword">Current Password</label>
              <input
                type="password"
                name="currPassword"
                id="currPassword"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
              />
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Save !</button>
        </form>
        <div className="google2fa">
          <label>Google 2FA Setup</label>
          <button type="button" onClick={handleGoogle2faSetup}>
            Enable Google 2FA
          </button>
          <p>
            Scan the QR code with the Google Authenticator app and enter the
            code below.
          </p>
          <input
            type="text"
            name="google2faCode"
            id="google2faCode"
            placeholder="Enter Google Authenticator code"
            value={google2faCode}
            onChange={(e) => setGoogle2faCode(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default Settings;
