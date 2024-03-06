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
  getYardDetail,
  getSlotNotJoined,
} from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountdownTimer from "../../component/countDownTime";

function NewFeed({ inforWallet, tranPoint, yards }) {
  const { id } = useParams();
  const { idclubmem } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [clubDetail, setClubDetail] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // const [slotsInClub, setSlotsInClub] = useState([]);
  // const [slotJoined, setSlotJoined] = useState([]);
  const [slotNotJoined, setSlotNotJoined] = useState([]);
  async function fetchData() {
    try {
      const [clubDetailRes, slotNotJoinedRes] = await Promise.all([
        getDetailClub(id),
        // getPostInClub(id),
        // getSlotJoined(idclubmem),
        getSlotNotJoined(idclubmem, id),
      ]);

      setSlotNotJoined(slotNotJoinedRes.result);
      setClubDetail(clubDetailRes.result);
      // setSlotsInClub(slotsInClubRes.result);
      // setSlotJoined(slotJoinedRes.result);

      const promises = slotNotJoinedRes.result.map(async (item) => {
        const response = await getNumberOfSlot(item.id);
        return { itemId: item.id, numberOfSlot: response.result };
      });

      const results = await Promise.all(promises);
      const numberOfSlotMap = {};
      results.forEach((result) => {
        numberOfSlotMap[result.itemId] = result.numberOfSlot;
      });
      setNumberOfSlot(numberOfSlotMap);

      setIsLoading(false);
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
      setIsLoading(true);
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

      console.log("join");

      window.location.reload();
    } catch (error) {
      showErrorToast("Error joining slot!");
      console.error("Error joining slot:", error);
    }
  }

  console.log(tranPoint);

  return (
    <div className="new-feed-container">
      <div className="club-title-new-feed">
        <span>{clubDetail.name}</span>
      </div>
      <div className="post-container">
        <img alt="avatar" src={userInfo.image} />
        <button className="write-btn" onClick={toggleModal}>
          <span className="btn-post-title">
            {userInfo.name} ơi! Hãy rủ thêm đồng đội chơi thể thao cùng nhé!
          </span>
        </button>
      </div>

      <h5>Bài viết mới nhất</h5>

      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
      )}

      {slotNotJoined.map((item, index) => {
        if (item.memberPostId == idclubmem) {
          return null;
        }

        const time = item.date + "T" + item.startTime + ":00";
        const targetTime = new Date(time).getTime();
        const currentTime = new Date().getTime();

        if (targetTime < currentTime) {
          return null;
        }

        const date = new Date(item.dateTime);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

        const remainingSlots =
          parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
        const isFull = remainingSlots <= 0;

        //get yard details
        const yardDetails = yards.find((yard) => {
          return yard.id === item.yardId;
        });

        return (
          <div key={item.id} className="main-post-container">
            <div className="poster-name">
              <div>
                <p>{item.memberPostName}</p>
                <div style={{ fontSize: "18px" }}>{timePost}</div>
              </div>
              <div>
                <CountdownTimer targetTime={time} />
              </div>
            </div>
            <div className="caption">{item.description}</div>
            <div className="post-content-container">
              <img className="post-img" src={item.image} alt="avatar" />
              <div className="post-infor">
                <h3>Thông tin trận đấu</h3>
                <div>
                  <div>
                    <b>Khu: {yardDetails?.areaName} </b>
                  </div>
                  <div>
                    <b>
                      Sân: {yardDetails?.sportName} - {item.yardName}
                    </b>
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
                  <button
                    className="btn-join"
                    disabled
                    style={{ backgroundColor: "gray" }}
                  >
                    Full
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
