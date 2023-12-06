import React, { useState, useRef, useEffect } from 'react';
import './Main.css';

const Main = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const inputRef = useRef();
  const outputRef = useRef();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      console.log(input);
      const result = processCommand(input);
      setOutput([...output, { command: input, result }]);
      setInput('');
      onSignUp();
    }
  };

  const processCommand = (command) => {
    return "잠시만 기다려 주세요. 10초 정도 소요됩니다.";
  };

  const onSignUp = () => {
    //'http://34.64.242.154:5000'  server ip address
    fetch('http://127.0.0.1:5000', {
      method: 'POST',
      body: JSON.stringify({ question: input }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(res => 
      {
        console.log(res);
        const answer = res.answer; // "answer"의 값을 추출
        setOutput([...output, { command: input, result: answer }]);
      })
    .catch(error => console.error('Error:', error));
  };
  

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <div className="main-container">
      <div className="output" ref={outputRef}>
        {output.map((item, index) => (
          <div key={index}>
            <p style={{ textAlign: 'left' }}>
              <strong>질문:</strong> {item.command}
              <br />
              <strong>답변:</strong> {item.result}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        name="q"
        className="input-box"
        placeholder="질문을 입력해주세요."
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleEnterPress}
      />
    </div>
  );
};

export default Main;
