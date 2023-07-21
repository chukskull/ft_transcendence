// ChatBox.tsx
import React from 'react';
import style from '../styles/Chat.module.scss';

const ChatBox: React.FC = () => {
  return (
    <div className={style.chatBox}>
      <div className={style.messages}>
        {/* Render messages here */}
      </div>
      <div className={style.input}>
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
