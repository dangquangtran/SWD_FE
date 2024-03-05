import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MainClubPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faEnvelopesBulk,
} from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-regular-svg-icons";

import NewFeed from "../NewFeed/NewFeed";
import MyPost from "../MyPost/MyPost";
import MyJoinPost from "../MyJoinPost/MyJoinPost";
import HistoryPage from "../HistoryPage/HistoryPage";
import { getTranPoint, getWalletByMemberId } from "../../services/userService";

function MainClubPage() {
  const [activeTab, setActiveTab] = useState("newFeed");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [inforWallet, setInforWallet] = useState();
  const [tranPoint, setTranPoint] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const walletRes = await getWalletByMemberId(userInfo.id);
        const tranPointRes = getTranPoint();
        setInforWallet(walletRes.result);
        setTranPoint(tranPointRes.result);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);
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
            className={`tab-btn ${activeTab === "newFeed" ? "active" : ""}`}
            onClick={() => handleTabClick("newFeed")}
          >
            <FontAwesomeIcon icon={faNewspaper} /> Bảng tin
          </button>

          <button
            className={`tab-btn ${activeTab === "myPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Bài đăng của tôi
          </button>

          <button
            className={`tab-btn ${activeTab === "myJoinPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myJoinPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Bài đăng đã tham gia
          </button>
          <button
            className={`tab-btn ${activeTab === "myHistory" ? "active" : ""}`}
            onClick={() => handleTabClick("myHistory")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Ví
          </button>
        </div>
        {activeTab === "newFeed" && (
          <NewFeed inforWallet={inforWallet} tranPoint={tranPoint} />
        )}
        {activeTab === "myPost" && (
          <MyPost tranPoint={tranPoint} inforWallet={inforWallet} />
        )}
        {activeTab === "myJoinPost" && <MyJoinPost />}
        {activeTab === "myHistory" && <HistoryPage inforWallet={inforWallet} />}
      </div>
    </>
  );
}

export default MainClubPage;
