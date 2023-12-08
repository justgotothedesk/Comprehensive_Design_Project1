import React from "react";
import "./Mobile_Header.css";
import Button from "react-bootstrap/Button";
import { AlignLeft, ArrowCounterClockwise } from "@phosphor-icons/react";

const Header = () => {
    return (
        <div className="header">
            <div className="header-left">
                <AlignLeft size={32} />
            </div>
            <div className="header-center">
                <img src="logo.png" alt="logo" />
                <h2>죄잇나 ver. 1.0</h2>
            </div>
            <div className="header-right">
                <ArrowCounterClockwise size={32} />
            </div>
        </div>
    );
};

export default Header;
