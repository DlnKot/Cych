import React, { useState, useEffect } from "react";
import UserIcon from "./UserIcon";
import { FaCog } from "react-icons/fa";

const Sidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // В будущем тут будет запрос к серверу для получения списка пользователей
    setUsers(["User1", "User2", "User3"]);
  }, []);

  return (
    <div className="sidebar">
      {users.map((user, index) => (
        <div key={index} className="sidebar-item">
          <UserIcon username={user} />
        </div>
      ))}

      <button className="settings-btn">
        <FaCog size={24} /> {/* Размер иконки */}
      </button>
    </div>
  );
};

export default Sidebar;
