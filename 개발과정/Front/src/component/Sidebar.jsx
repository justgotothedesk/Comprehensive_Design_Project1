import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div id="sidebar">
      <div className="header-container">
        <img src="logo.png" alt="logo" style={{ width: '100px', height: '100px' }} />
        <h3 style={{ marginLeft: '10px' }}>환영합니다.</h3>
      </div>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Contact</a>
    </div>
  );
};

export default Sidebar;
