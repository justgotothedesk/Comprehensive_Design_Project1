import React from 'react';
import './Sidebar.css';
import Badge from 'react-bootstrap/Badge';

const Sidebar = () => {
  const openWindow = (url) => {
    const width = 400;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const contentMap = {
      '/about': `
        <div>
          <h2>강의잇나는요</h2>
          <p>구글의 대규모 언어모델을 학습하여 탄생하였습니다.</p>
          <p>원하는 강의를 추천하고 평가해줍니다.</p>
        </div>
      `,
      '/services': `
        <div>
          <h2>강의잇나 이용방법</h2>
          <p>해당 강의의 전반적인 점수를 알고 싶을 때</p>
          <p>수강하고 싶은 과목의 종류가 너무 많을 때</p>
        </div>
      `,
      '/contact': `
        <div>
          <h2>궁금하신게 있다면?</h2>
          <p>김근찬 @pau._.ler</p>
          <p>신진철 @99_flor</p>
          <p>신성한 @sunghan_s</p>
          <p>조정래 @jungrae</p>
        </div>
      `,
    };

    const newWindow = window.open('', '_blank', `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    newWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
            }

            h2 {
              color: #4285f4;
            }

            p {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          ${contentMap[url] || '<h2>내용이 없습니다.</h2>'}
        </body>
      </html>
    `);
  };

  return (
    <div id="sidebar">
      <div id="sidebar-header">
        <h2><Badge bg="secondary">NEW CHAT</Badge></h2>
      </div>
      <hr></hr>
      <div id="sidebar-body">
      <a href="/">Home</a>
        <a href="#" onClick={() => openWindow('/about')}>About</a>
      <a href="#" onClick={() => openWindow('/services')}>Services</a>
      <a href="#" onClick={() => openWindow('/contact')}>Contact</a>

      </div>
      <hr></hr>
      <div id="sidebar-footer">
        <p>무엇이 들어가면 좋을지 고민중...</p>
      </div>
    </div>
  );
};

export default Sidebar;
