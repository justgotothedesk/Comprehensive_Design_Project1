import React from "react";
import "./Header.css";
import Button from "react-bootstrap/Button";

const Header = () => {
    return (
        <div className="header">
            <img src="logo.png" alt="logo" />
            <h2>강의잇나 ver. 1.0</h2>
        </div>
    );
};

export default Header;
