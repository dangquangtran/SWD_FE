import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainClubPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import NewFeed from "../NewFeed/NewFeed";


function MainClubPage() {
    const [showTabs, setShowTabs] = useState(false);
    const [activeTab, setActiveTab] = useState("newFeed");

    const toggleTabs = () => {
        setShowTabs(!showTabs);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const navigate = useNavigate();
    return (
        <>
            <div className="main-club-container">
                <div className="side-bar">
                    <button className="  btn-back" onClick={() => navigate("/members")}> Home</button>
                    <button className={`tab-btn ${activeTab === "home" ? "active" : ""
                        }`} onClick={() => handleTabClick("newFeed")}> New feed</button>

                    <button className="tab-btn" onClick={toggleTabs}> Your posted {showTabs ? (<FontAwesomeIcon icon={faAngleDown} />) : (<FontAwesomeIcon icon={faAngleRight} />)}</button>
                    {showTabs && (
                        <div className="sub-tabs">
                            <button className="sub-tab">Badminton post</button>
                            <button className="sub-tab">Tennis post</button>
                            <button className="sub-tab">Basketball post</button>
                        </div>
                    )}


                </div>
                {activeTab === "newFeed" && <NewFeed />}

            </div>
        </>
    )
}

export default MainClubPage;