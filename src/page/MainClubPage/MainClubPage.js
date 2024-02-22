import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainClubPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faEnvelopesBulk,
} from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-regular-svg-icons";

import NewFeed from "../NewFeed/NewFeed";
import MyPost from "../MyPost/MyPost";

function MainClubPage() {
  const [activeTab, setActiveTab] = useState("newFeed");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="main-club-container">
        <div className="side-bar-main">
          <button className="btn-backHome" onClick={() => navigate("/members")}>
            <FontAwesomeIcon icon={faHouseUser} /> Home
          </button>
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleTabClick("newFeed")}
          >
            <FontAwesomeIcon icon={faNewspaper} /> New feed
          </button>

          <button className="tab-btn" onClick={() => handleTabClick("myPost")}>
            <FontAwesomeIcon icon={faEnvelopesBulk} /> My posted{" "}
          </button>

          <button className="tab-btn" onClick={() => handleTabClick("myPost")}>
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Posts joined{" "}
          </button>
        </div>
        {activeTab === "newFeed" && <NewFeed />}
        {activeTab === "myPost" && <MyPost />}
      </div>
    </>
  );
}

export default MainClubPage;
