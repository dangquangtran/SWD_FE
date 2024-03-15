import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MainClubPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faEnvelopesBulk,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendarCheck,
  faCalendarXmark
} from "@fortawesome/free-regular-svg-icons";
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
import MyPostNotDone from "../MyPost/MyPostNotDone/MyPostNotDone";
import MyPostDone from "../MyPost/MyPostDone/MyPostDone";

function MainClubPage() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [activeTab, setActiveTab] = useState("newFeed");
  const [activeTabPost, setActiveTabPost] = useState("newFeed");
  const [inforWallet, setInforWallet] = useState();
  const [tranPoint, setTranPoint] = useState({});
  const [yards, setYards] = useState([]);
  const [clubDetail, setClubDetail] = useState({});
  const [myPostInClub, setMyPostInClub] = useState([]);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveTabPost(null);
  };

  const handleTabClickPost = (tab) => {
    setActiveTabPost(tab);
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="main-club-container">
        <div className="side-bar-main">
          {/* <button className="btn-backHome" onClick={() => navigate("/members")}>
              <FontAwesomeIcon icon={faHouseUser} /> Trang chủ
            </button> */}
          <button
            className={`tab-btn ${activeTab === "newFeed" ? "active" : ""}`}
            onClick={() => handleTabClick("newFeed")}
          >
            <FontAwesomeIcon icon={faNewspaper} /> Hoạt động mới
          </button>

          <button
            className={`myAction tab-btn ${activeTab === "myPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Hoạt động của tôi {activeTab === "myPost" ? <FontAwesomeIcon className="icon-myaction" icon={faAngleDown} /> : <FontAwesomeIcon className="icon-myaction" icon={faAngleRight} />}
          </button>
          {activeTab === "myPost" && (
            <div
              className="tab-content"
              style={{
                marginLeft: "50px",
              }}
            >
              <button
                className={`finished ${activeTabPost === "done" ? "active" : ""
                  }`}
                onClick={() => handleTabClickPost("done")}
              >
                <FontAwesomeIcon icon={faCalendarCheck} /> Hoạt động kết thúc
              </button>
              <button
                className={`not-finished ${activeTabPost === "notDone" ? "active" : ""
                  }`}
                onClick={() => handleTabClickPost("notDone")}
              >
                <FontAwesomeIcon icon={faCalendarXmark} /> Hoạt động chưa kết thúc
              </button>
            </div>
          )}

          <button
            className={`tab-btn ${activeTab === "myJoinPost" ? "active" : ""}`}
            onClick={() => handleTabClick("myJoinPost")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Hoạt động đã tham gia
          </button>
          <button
            className={`tab-btn ${activeTab === "myHistory" ? "active" : ""}`}
            onClick={() => handleTabClick("myHistory")}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} /> Ví của tôi
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
        {activeTab === "myPost" && !activeTabPost && (
          <MyPost
            setMyPostInClub={setMyPostInClub}
            myPostInClub={myPostInClub}
            tranPoint={tranPoint}
            inforWallet={inforWallet}
            yards={yards}
            clubDetail={clubDetail}
          />
        )}
        {activeTabPost === "notDone" && (
          <MyPostNotDone
            myPostInClub={myPostInClub}
            tranPoint={tranPoint}
            inforWallet={inforWallet}
            yards={yards}
            clubDetail={clubDetail}
          />
        )}

        {activeTabPost === "done" && (
          <MyPostDone
            myPostInClub={myPostInClub}
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
