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
import {
  getTranPoint,
  getWalletByMemberId,
  getDetailClub,
  getYards,
} from "../../services/userService";

function MainClubPage() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [activeTab, setActiveTab] = useState("newFeed");
  const [inforWallet, setInforWallet] = useState();
  const [tranPoint, setTranPoint] = useState({});
  const [yards, setYards] = useState([]);
  const [clubDetail, setClubDetail] = useState({});

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [walletRes, tranPointRes, yardsRes, clubDetailRes] =
          await Promise.all([
            getWalletByMemberId(userInfo.id),
            getTranPoint(),
            getYards(),
            getDetailClub(id),
          ]);

        setInforWallet(walletRes.result);
        setTranPoint(tranPointRes.result);
        setYards(yardsRes.result);
        setClubDetail(clubDetailRes.result);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);

  console.log(tranPoint);
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
            <FontAwesomeIcon icon={faNewspaper} /> Hoạt động mới
          </button>

          <button
            className={`tab-btn ${activeTab === "myPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Hoạt động của tôi
          </button>

          <button
            className={`tab-btn ${activeTab === "myJoinPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myJoinPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} />
            Hoạt động đã tham gia
          </button>
          <button
            className={`tab-btn ${activeTab === "myHistory" ? "active" : ""}`}
            onClick={() => handleTabClick("myHistory")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Ví của tôi
          </button>
        </div>

        {activeTab === "newFeed" && (
          <NewFeed
            inforWallet={inforWallet}
            tranPoint={tranPoint}
            yards={yards}
            setActiveTab={setActiveTab}
            clubDetail={clubDetail}
          />
        )}
        {activeTab === "myPost" && (
          <MyPost
            tranPoint={tranPoint}
            inforWallet={inforWallet}
            yards={yards}
            clubDetail={clubDetail}
          />
        )}
        {activeTab === "myJoinPost" && (
          <MyJoinPost yards={yards} clubDetail={clubDetail} />
        )}
        {activeTab === "myHistory" && (
          <HistoryPage inforWallet={inforWallet} clubDetail={clubDetail} />
        )}
      </div>
    </>
  );
}

export default MainClubPage;
