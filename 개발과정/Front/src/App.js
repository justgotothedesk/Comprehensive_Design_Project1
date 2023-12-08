import React from "react";
import "./App.css";
import Main from "./component/Main";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Mobile_Header from "./component/Mobile_Header";
import { useMediaQuery } from "react-responsive";

function App() {
    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    });

    return (
        <div className="App">
            {isMobile && (
                <div className="mobile-box">
                    <div className="mobile-header">
                        <Mobile_Header />
                    </div>
                    <div className="mobile-body">
                        body
                    </div>
                    <div className="mobile-footer">
                        head
                    </div>
                </div>
            )}
            {!isMobile && (
                <div className="pc-box">
                    <div class="sidebar">
                        <Sidebar />
                    </div>
                    <div class="non-sidebar">
                        <Header />
                        <Main />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
