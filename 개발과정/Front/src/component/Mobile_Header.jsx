import React from "react";
import "./Mobile_Header.css";
import Button from "react-bootstrap/Button";
import { AlignLeft, ArrowCounterClockwise } from "@phosphor-icons/react";

const Mobile_Header = () => {
    return (
        <div className="mobile-header">
            <div className="header-left">
                <AlignLeft size={32} />
                {/* 해당 버튼 클릭 -> 예시 및 설명 */}
            </div>
            <div className="header-center">
                <img src="logo.png" alt="logo" />
            </div>
            <div className="header-right">
                <ArrowCounterClockwise size={32} />
                {/* 해당 버튼 클릭 -> reset */}
            </div>
        </div>
    );
};

export default Mobile_Header;
