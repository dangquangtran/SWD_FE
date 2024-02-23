import React, { useEffect, useState } from "react";
import "./NewFeed.scss";

import {
  getDetailClub,
  getPostInClub,
  createPostInSlot,
  UserJointSlot,
  getTranPoint,
  getSlotJoined,
  getNumberOfSlot,
  getWalletByMemberId,
} from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

import {
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NewFeed() {
  const { id } = useParams();
  const { idclubmem } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [clubDetail, setClubDetail] = useState({});
  const [slotsInClub, setSlotsInClub] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tranPoint, setTranPoint] = useState(null);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [slotJoined, setSlotJoined] = useState([]);
  const [inforWallet, setInforWallet] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const [clubDetailRes, slotsInClubRes, slotJoinedRes, tranPointRes] =
        await Promise.all([
          getDetailClub(id),
          getPostInClub(id),
          getSlotJoined(idclubmem),
          getTranPoint(),
        ]);

      setTranPoint(tranPointRes.result);
      setClubDetail(clubDetailRes.result);
      setSlotsInClub(slotsInClubRes.result);
      setSlotJoined(slotJoinedRes.result);

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

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreatePost = async (postData) => {
    postData.memberPostName = userInfo.name;
    postData.clubId = id;
    postData.memberPostId = idclubmem;
    try {
      await createPostInSlot(postData);
      showSuccessToast("Create post successfully!");
      setIsModalOpen(false);
      setIsLoading(true)
      fetchData();
    } catch (error) {
      showErrorToast("Create post error!");
      console.error("Error creating post:", error);
    }
  };

  async function handleJoinSlot(slotId) {
    try {
      await UserJointSlot({
        tranPoint: tranPoint,
        inforWallet: inforWallet,
        newClubMemSlot: {
          clubMemberId: idclubmem,
          slotId: slotId,
          transactionPoint: tranPoint.point,
        },
      });

      window.location.reload();

      // const slotJoinedRes = await getSlotJoined(idclubmem);
      // setSlotJoined(slotJoinedRes.result);

      // const promises = slotsInClub.map(async (item) => {
      //   const response = await getNumberOfSlot(item.id);
      //   return { itemId: item.id, numberOfSlot: response.result };
      // });

      // const results = await Promise.all(promises);
      // const numberOfSlotMap = {};
      // results.forEach((result) => {
      //   numberOfSlotMap[result.itemId] = result.numberOfSlot;
      // });
      // setNumberOfSlot(numberOfSlotMap);

      // console.log(slotJoinedRes.result);

      // fetchData();
      // showSuccessToast('Join slot successfully!');
      // fetchData();
    } catch (error) {
      showErrorToast("Error joining slot!");
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

      {isLoading && <FontAwesomeIcon icon={faSpinner} className="loading-icon" />}

      {slotsInClub.map((item) => {
        if (item.memberPostId === idclubmem) {
          return null;
        }

        // Kiểm tra xem slot có trong mảng slotJoined không
        const isJoined = slotJoined.some(
          (joinedSlot) => joinedSlot.slotId === item.id
        );
        {
          if (isJoined) return null;
        }

        const remainingSlots = parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
        const isFull = remainingSlots <= 0;

        return (
          <div key={item.id} className="main-post-container">
            <div className="poster-name">
              <p>{item.memberPostName}</p>
              <div>{item.dateTime}</div>
            </div>
            <div className="caption">{item.description}</div>
            <div className="post-content-container">
              <img className="post-img" src={item.image} alt="avatar" />
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
                {isFull ? (
                  <button className="btn-join" disabled style={{backgroundColor: 'gray'}}>
                    Full
                  </button>
                ) : isJoined ? (
                  <button className="btn-join" disabled>
                    Joined
                  </button>
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