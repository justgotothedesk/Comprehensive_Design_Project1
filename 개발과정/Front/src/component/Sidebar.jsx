import React from 'react';
import Button from 'react-bootstrap/Button';
import './Sidebar.css';

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
          <p>"(교수명) 교수님 수업 추천해줘"</p>
          <p>"(과목명) 수업 추천해줘"</p>
          <p>"(교수명 + 과목명) 어때?"</p>
          <p>형태로 물어봐주시면 친절히 답변드립니다.</p>
        </div>
      `,
      '/contact': `
        <div>
          <h2>궁금하신게 있다면?</h2>
          <p>김근찬 @pau._.ler29</p>
          <p>신성한 @sunghans_s</p>
          <p>신진철 @99_flor</p>
          <p>조정래 @jun9rae</p>
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
        <div className="d-grid gap-2">
          <Button variant="outline-secondary" size="sm">NEW CHAT</Button>
        </div>
      </div>
      <hr></hr>
      <div id="sidebar-body">
        <a onClick={() => openWindow('/about')}>About</a>
        <a onClick={() => openWindow('/services')}>How to Use</a>
        <a onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScLgGbe6GTl0-5ocKXeBFN2WPYp98-qELmiG6AyxQLRLYqz5w/viewform')}>Survey</a>
        <a onClick={() => openWindow('/contact')}>Contact</a>
      </div>
    </div>
  );
};

export default Sidebar;
