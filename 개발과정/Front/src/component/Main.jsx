import { PaperPlaneTilt } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import "./Main.css";

const Main = () => {
    console.log(sessionStorage.getItem('user_id'))
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
        return <div className="blink">
            ⦁
        </div>;
    };

    const onSignUp = () => {
        //'http://34.64.242.154:5000'  server ip address
        fetch("http://34.64.148.223:5000/chat", {
            method: "POST",
            body: JSON.stringify({ question: input , id : sessionStorage.getItem('user_id')}),
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
        <div className="main-container">
            <div className="output" ref={outputRef}>
                {output.map((item, index) => (
                    <div key={index} className="answer">
                        <p style={{ textAlign: "left" }}>
                            <strong>You</strong>
                            <div className="question">
                                {item.command}
                            </div>
                            <strong>강의잇나</strong>
                            <div className="question">
                                {item.result}
                            </div>
                        </p>
                    </div>
                    
                ))}
            </div>
            <div className="input">
                <input
                    type="text"
                    name="q"
                    className="input-field"
                    placeholder="질문을 입력해주세요."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleEnterPress}
                />
                <PaperPlaneTilt
                    size={20}
                    className="mobile-input-button"
                    onClick={handleClick}
                />
            </div>
        </div>
    );
};

export default Main;
