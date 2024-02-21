import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainClubPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faHouseUser,
  faEnvelopesBulk,
  faBasketball,
} from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-regular-svg-icons";

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
        <div className="side-bar-main">
          <button className="  btn-back" onClick={() => navigate("/members")}>
            <FontAwesomeIcon icon={faHouseUser} /> Home
          </button>
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleTabClick("newFeed")}
          >
            <FontAwesomeIcon icon={faNewspaper} /> New feed
          </button>

          <button className="tab-btn" onClick={toggleTabs}>
            <FontAwesomeIcon icon={faEnvelopesBulk} /> My posted{" "}
          </button>
        </div>
        {activeTab === "newFeed" && <NewFeed />}
      </div>
    </>
  );
}

export default MainClubPage;
