import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useMediaQuery } from "react-responsive";
import "./App.css";
import Header from "./component/Header";
import Main from "./component/Main";
import Mobile_Header from "./component/Mobile_Header";
import Mobile_Main from "./component/Mobile_Main";
import Sidebar from "./component/Sidebar";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [inputId, setInputId] = useState('');
    const [isID, setID] = useState(false);

    const handleInputId = (e) => {
        setInputId(e.target.value);
    }

    const onClickLogin = () => {
        console.log('click login')
        console.log('ID : ', inputId)
        make_session()
        sessionStorage.setItem('user_id', inputId)
        setIsLogin(true);
    }

    const make_session = () => {
        fetch("http://34.22.66.120:5000/login", {
            method: "POST",
            body: JSON.stringify({ id : inputId }),
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
            const answer = res.success;
            if (answer){
                setID(true);
            }
            console.log(answer);

        })
        .catch((error) => console.error("Error:", error));
    };

    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    });

    return (
        <div className="App">
            {isLogin && isID ?
                isMobile && ( //모바일이면
                    <div className="mobile-box">
                        <div className="mobile-header">
                            <Mobile_Header />
                        </div>
                        <div className="mobile-body">
                            <Mobile_Main />
                        </div>
                    </div>
                ) :
                isMobile && (
                    <div className="login-box">
                        <div className="login-header">
                            <img src="logo.png" alt="logo" />
                            <h2>강의잇나 ver. 1.0</h2>
                        </div>
                        <InputGroup>
                            <Form.Control
                                placeholder="Enter Nickname"
                                aria-label="Recipient's Username"
                                aria-describedby="basic-addon2"
                                name='input_id'
                                value={inputId}
                                onChange={handleInputId}
                            />
                            <Button
                                variant="secondary"
                                id="button-addon2"
                                onClick={onClickLogin}>
                                Login
                            </Button>
                        </InputGroup>
                    </div>
                )
            }
            {isLogin && isID ?  //모바일이 아니면
                !isMobile && (
                    <div className="pc-box">
                        <div class="sidebar">
                            <Sidebar />
                        </div>
                        <div class="non-sidebar">
                            <Header />
                            <Main />
                        </div>
                    </div>
                ) :
                !isMobile && (
                    <div className="login-box">
                        <div className="login-header">
                            <img src="logo.png" alt="logo" />
                            <h2>강의잇나 ver. 1.0</h2>
                        </div>
                        <InputGroup>
                            <Form.Control
                                placeholder="Enter Nickname"
                                aria-label="Recipient's Username"
                                aria-describedby="basic-addon2"
                                name='input_id'
                                value={inputId}
                                onChange={handleInputId}
                            />
                            <Button
                                variant="secondary"
                                id="button-addon2"
                                onClick={onClickLogin}>
                                Login
                            </Button>
                        </InputGroup>
                    </div>
                )}
        </div>
    );
}

export default App;