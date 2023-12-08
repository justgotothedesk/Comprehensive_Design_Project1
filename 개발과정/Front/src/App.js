import React from "react";
import "./App.css";
import Main from "./component/Main";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { useMediaQuery } from "react-responsive";

export const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    });

    return <>{isMobile && children}</>;
};

export const PC = ({ children }) => {
    const isPc = useMediaQuery({
        query: "(min-width:769px)",
    });

    return <div className="pc-box">{isPc && children}</div>;
};

function App() {
    return (
        <div className="App">
            <Mobile>Mobile</Mobile>
            <PC>
                <div class="sidebar">
                    <Sidebar />
                </div>
                <div class="non-sidebar">
                    <Header />
                    <Main />
                </div>
            </PC>
        </div>
    );
}

export default App;
