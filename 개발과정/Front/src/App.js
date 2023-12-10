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


    const handleInputId = (e) => {
        setInputId(e.target.value);
    }

    const onClickLogin = () => {
        console.log('click login')
        console.log('ID : ', inputId)
        make_session()
    }

    const make_session = () => {
        fetch("http://127.0.0.1:5000/login", {
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

            const data = response.json();

            if (data.success){
                sessionStorage.setItem('user_id', inputId)
                setIsLogin(true)
                return (<Main />)
            }
            else {
<<<<<<< HEAD
                <div>
                    <h4>이미 존재하는 닉네임입니다.</h4>
                </div>
            };
=======
                console.log("이미 존재하는 이름입니다. 다른 이름을 입력해주세요.");
            }
>>>>>>> f5edcc88d0237c20cd0bd82c5b7e60f1c0878a4f
            })
    };

    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    });

    return (
        <div className="App">
            {isLogin ?
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
            {isLogin ?  //모바일이 아니면
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
