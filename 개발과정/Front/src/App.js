import React from "react";
import "./App.css";
import Main from "./component/Main";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Mobile_Header from "./component/Mobile_Header";
import Mobile_Main from "./component/Mobile_Main";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from 'react';

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [inputId, setInputId] = useState('');

    const handleInputId = (e) => {
        setInputId(e.target.value);
    }

    const onClickLogin = () => {
        console.log('click login')
        console.log('ID : ', inputId)
        sessionStorage.setItem('user_id', inputId)
        setIsLogin(true)
    }

    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    });

    return (
        <div className="App">
            {isLogin ?
                isMobile && (
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
                            <h2>죄잇나 ver. 1.0</h2>
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
            {isLogin ?
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
                            <h2>죄잇나 ver. 1.0</h2>
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
