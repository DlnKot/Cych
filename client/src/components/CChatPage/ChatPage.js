import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';
import './ChatPage.css'; 

const ChatPage = () => {
  return (
    <div className="chat-container">
      <div className="messages-container">
        <MessageList />
        <MessageInput />
      </div>
      <Sidebar />
    </div>
  );
};

export default ChatPage;
