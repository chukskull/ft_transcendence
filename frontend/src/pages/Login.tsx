import React, { useState } from 'react';
import Modal from 'react-modal';
import style from '../styles/Login.module.scss';
import { Si42,SiRetropie } from 'react-icons/si';
interface Props {}

const LoginPage: React.FC<Props> = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = () => {
    // Handle login submission
  };

  const handle42Auth = () => {
    // Handle 42Auth
  };

  const handleRegister = () => {
    // Handle registration
  };

  return (
    <>
      <div className={style.login_container}>
        <div className={style.login_form}>
          <h1> <SiRetropie/>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required

          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required

          />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setShowModal(true)}>Register</button>
          <button className={style.btn42} onClick={handle42Auth}><Si42/> Intra Login</button>
        </div>

        <Modal className={style.register_modal} isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <div className={style.register_form}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required

          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required

          />
          <button onClick={handleRegister}>Register</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default LoginPage;