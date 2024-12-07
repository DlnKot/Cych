import React from 'react';

const UserIcon = ({ username }) => {
  return (
    <div className="user-icon">
      <span>{username[0]}</span>
    </div>
  );
};

export default UserIcon;
