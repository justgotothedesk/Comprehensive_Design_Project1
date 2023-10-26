import React, { useState, useRef, useEffect } from 'react';
import '../Main.css';

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
    return `${command}`;
  };

  const onSignUp = () => {
    fetch('백엔드 주소', {
      method: 'POST',
      body: JSON.stringify({
        question: input,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => console.log(res));
  };

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <div className="main-container">
      <div className="output" ref={outputRef}>
        {output.map((item, index) => (
          <div key={index}>
            <p style={{textAlign:'left'}}>
            <strong>질문:</strong> {item.command}
            <br />
            <strong>답변:</strong> {item.result}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
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
