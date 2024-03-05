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
} from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountdownTimer from "../../component/countDownTime";

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
  const [yardDetails, setYardDetails] = useState([]);

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
      console.log(slotsInClubRes.result);
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

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const details = await Promise.all(
        slotsInClub.map((item) => getYardDetail(item.yardId))
      );
      setYardDetails(details);
    };

    fetchData();
  }, [slotsInClub]);

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
          <span className="btn-post-title">
            {userInfo.name} ơi! Hãy rủ thêm đồng đội chơi thể thao cùng nhé!
          </span>
        </button>
      </div>

      <h5>Bài viết mới nhất</h5>

      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
      )}

      {slotsInClub.map((item, index) => {
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

        
        const isJoined = slotJoined.some(
          (joinedSlot) => joinedSlot.slotId === item.id
        );
        {
          if (isJoined) return null;
        }

        const remainingSlots =
          parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
        const isFull = remainingSlots <= 0;

        return (
          <div key={item.id} className="main-post-container">
            <div className="poster-name">
              <p>{item.memberPostName}</p>
              <div>{timePost}</div>
              <CountdownTimer targetTime={time} />
            </div>
            <div className="caption">{item.description}</div>
            <div className="post-content-container">
              <img className="post-img" src={item.image} alt="avatar" />
              <div className="post-infor">
                <h3>Thông tin trận đấu</h3>
                <div>
                  <div>
                    <b>Khu: {yardDetails[index]?.result.areaName} </b>
                  </div>
                  <div>
                    <b>
                      Sân: {yardDetails[index]?.result.sportName} -{" "}
                      {item.yardName}
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
