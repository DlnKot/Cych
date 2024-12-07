import React, { useState, useEffect } from 'react';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // В будущем здесь будет подключение к серверу через socket.io
    setMessages([
      { user: 'User1', text: 'Hello!' },
      { user: 'User2', text: 'Hi there!' },
      { user: 'User3', text: 'How are you?' },
    ]);
  }, []);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.user}: </strong>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
