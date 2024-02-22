import React, { useEffect, useState } from "react";
import "./NewFeed.scss";
import image1 from "../../assets/Sport/badminton.jpg";

import {
  getDetailClub,
  getPostInClub,
  createPostInSlot,
  getIdMemberCreatePost,
  UserJoitSlot,
  getTranPoit,
  getSlotJoined,
  getNumberOfSlot,
  getWalletByMemberId,
} from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

function NewFeed() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [clubDetail, setClubDetail] = useState({});
  const [slotsInClub, setSlotsInClub] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberCreatePostId, setMemberCreatePostId] = useState(null);
  const [tranPoint, setTranPoint] = useState(null);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [slotJoined, setSetSlotJoined] = useState([]);
  const [inforWallet, setInforWallet] = useState({});

  async function fetchData() {
    try {
      const [clubDetailRes, slotsInClubRes, tranPointRes] = await Promise.all([
        getDetailClub(id),
        getPostInClub(id),
        getTranPoit(),
      ]);

      setClubDetail(clubDetailRes.result);
      setSlotsInClub(slotsInClubRes.result);
      setTranPoint(tranPointRes.result);

      const memberCreatePostRes = await getIdMemberCreatePost(userInfo.id, id);
      setMemberCreatePostId(memberCreatePostRes.result.id);

      const slotJoinedRes = await getSlotJoined(memberCreatePostRes.result.id);
      setSetSlotJoined(slotJoinedRes.result);

      const promises = slotsInClubRes.result.map(async (item) => {
        const response = await getNumberOfSlot(item.id);
        return { itemId: item.id, numberOfSlot: response.result };
      });

      const results = await Promise.all(promises);
      const numberOfSlotMap = {};
      results.forEach((result) => {
        numberOfSlotMap[result.itemId] = result.numberOfSlot;
      });
      setNumberOfSlot(numberOfSlotMap);

      const walletRes = await getWalletByMemberId(userInfo.id);
      setInforWallet(walletRes.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id, userInfo.id]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreatePost = async (postData) => {
    postData.memberPostName = userInfo.name;
    postData.clubId = id;
    postData.memberPostId = isMemberCreatePostId;
    try {
      await createPostInSlot(postData);
      showSuccessToast("Create post successfully!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showErrorToast("Create post error!");
      console.error("Error creating post:", error);
    }
  };

  async function handleJoinSlot(slotId) {
    try {
      await UserJoitSlot({
        tranPoint: tranPoint,
        inforWallet: inforWallet,
        newClubMemSlot: {
          clubMemberId: isMemberCreatePostId,
          slotId: slotId,
          transactionPoint: tranPoint.point,
        },
      });

      fetchData();
    } catch (error) {
      console.error("Error joining slot:", error);
    }
  }

  return (
    <div className="new-feed-container">
      <div className="club-title-new-feed">{clubDetail.name}</div>
      <div className="post-container">
        <img alt="avatar" src={userInfo.image} />
        <button className="write-btn" onClick={toggleModal}>
          <span>{userInfo.name} ơi</span>
          <span style={{ marginLeft: "5px" }}>Bạn đang muốn gì thế?</span>
        </button>
      </div>

      <h5>Bài viết mới nhất</h5>

      {slotsInClub.map((item) => {
        if (item.memberPostId === isMemberCreatePostId) {
          return null;
        }

        // Kiểm tra xem slot có trong mảng slotJoined không
        const isJoined = slotJoined.some(
          (joinedSlot) => joinedSlot.slotId === item.id
        );

        return (
          <div key={item.id} className="main-post-container">
            <div className="poster-name">
              <p>{item.memberPostName}</p>
              <div>{item.dateTime}</div>
            </div>
            <div className="caption">{item.description}</div>
            <div className="post-content-container">
              <img className="post-img" src={image1} alt="avatar" />
              <div className="post-infor">
                <h3>Thông tin trận đấu</h3>
                <div>
                  <div>
                    <b>Sân: {item.yardName}</b>
                  </div>
                  <div>
                    <b>
                      Thời gian: {item.startTime} - {item.endTime}
                    </b>
                  </div>
                  <div>
                    <b>Date: {item.date}</b>
                  </div>
                  <div>
                    <b>
                      Tổng số người chơi:{" "}
                      {parseInt(item.requiredMember) +
                        parseInt(item.currentMember)}
                    </b>
                  </div>
                  <div>
                    <b>
                      Còn:{" "}
                      {parseInt(item.requiredMember) -
                        parseInt(numberOfSlot[item.id] || 0)}
                    </b>
                  </div>
                </div>
                {isJoined ? (
                  <button className="btn-join">Joined</button>
                ) : (
                  <button
                    className="btn-join"
                    onClick={() => {
                      handleJoinSlot(item.id);
                    }}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <ModalCreatePost
        isOpen={isModalOpen}
        toggle={toggleModal}
        createPost={handleCreatePost}
      />
    </div>
  );
}

export default NewFeed;
