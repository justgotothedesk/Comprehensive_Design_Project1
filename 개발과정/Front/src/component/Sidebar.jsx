import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="chat-history">
        
        <ul>
          <li><button>Chat 1</button></li>
          <li><button>Chat 2</button></li>
          {/* 추가적인 채팅 기록 버튼들 */}
        </ul>
      </div>

      <div className="setting">
        <div>
            <button className='buttons'>Help</button>
        </div>
        <div>
            <button className='buttons'>Setting</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
