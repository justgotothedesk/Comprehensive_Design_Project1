import React, { useState, useRef, useEffect } from "react";
import "./Mobile_Main.css";
import Button from "react-bootstrap/Button";
import { PaperPlaneTilt } from "@phosphor-icons/react";

const Mobile_Body = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState([]);
    // const inputRef = useRef();
    const outputRef = useRef();

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            console.log(input);
            const result = processCommand(input);
            setOutput([...output, { command: input, result }]);
            setInput("");
            onSignUp();
        }
    };

    const handleClick = (e) => {
        console.log(input);
        const result = processCommand(input);
        setOutput([...output, { command: input, result }]);
        setInput("");
        onSignUp();
    };
    const processCommand = (command) => {
        return "잠시만 기다려 주세요. 10초 정도 소요됩니다.";
    };

    const onSignUp = () => {
        //'http://34.64.242.154:5000'  server ip address
        fetch("http://127.0.0.1:5000", {
            method: "POST",
            body: JSON.stringify({ question: input }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((res) => {
                console.log(res);
                const answer = res.answer; // "answer"의 값을 추출
                setOutput([...output, { command: input, result: answer }]);
            })
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, [output]);

    return (
        <div className="mobile-main-container">
            <div className="mobile-output" ref={outputRef}>
                {output.map((item, index) => (
                    <div key={index} className="mobile-answer">
                        <p style={{ textAlign: "left" }}>
                            <strong>You</strong> 
                            <div className="mobile-question">
                                {item.command}
                            </div>
                            <strong>강의잇나</strong> 
                            <div className="mobile-animation" >
                                {item.result}
                            </div>
                        </p>
                    </div>
                ))}
            </div>
            <div className="mobile-input">
                    <input
                        type="text"
                        name="q"
                        className="mobile-input-field"
                        placeholder="질문을 입력해주세요."
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleEnterPress}
                    />
                    <PaperPlaneTilt size={20}
                        className="mobile-input-button"
                        onClick={handleClick}
                    />            
            </div>
        </div>
    );
};

export default Mobile_Body;
