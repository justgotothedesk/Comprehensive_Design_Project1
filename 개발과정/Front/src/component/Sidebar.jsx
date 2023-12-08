import React from 'react';
import './Sidebar.css';
import Button from 'react-bootstrap/Button';

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
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&display=swap');

            body {
              font-family: 'Noto Sans KR', sans-serif;
              margin: 20px;
            }

            h2 {
              color: 	# 808080;
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
        <Button variant="outline-secondary" size="sm">NEW CHAT</Button>
      </div>
      <hr></hr>
      <div id="sidebar-body">
        <a href="/">위는 새로운 채팅 생성</a>
        <a href="/">여기는 History</a>
        <a href="/">목록 list 넣어야할듯</a>
      </div>
      <hr></hr>
      <div id="sidebar-footer">
        <Button variant="outline-secondary" onClick={() => openWindow('/about')} size="sm">About</Button>{' '}
        <Button variant="outline-secondary" onClick={() => openWindow('/services')} size="sm">Services</Button>{' '}
        <Button variant="outline-secondary" onClick={() => openWindow('/contact')} size="sm">Contact</Button>
      </div>
    </div>
  );
};

export default Sidebar;
