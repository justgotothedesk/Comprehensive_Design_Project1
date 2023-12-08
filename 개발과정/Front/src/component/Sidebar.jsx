import React from 'react';
import './Sidebar.css';
import Badge from 'react-bootstrap/Badge';

const Sidebar = () => {
  return (
    <div id="sidebar">
      <div id="sidebar-header">
        <h2><Badge bg="secondary">NEW CHAT</Badge></h2>
      </div>
      <hr></hr>
      <div id="sidebar-body">
        <a class="history" href="#">히스토리 저장할 때</a>
        <a class="history" href="#">여기에 추가</a>
      </div>
      <hr></hr>
      <div id="sidebar-footer">
        <p>무엇이 들어가면 좋을지 고민중...</p>
      </div>
    </div>
  );
};

export default Sidebar;
