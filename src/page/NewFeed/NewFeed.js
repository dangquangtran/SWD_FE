import React, { useEffect, useState } from "react";
import "./NewFeed.scss";

import {
  createPostInSlot,
  UserJointSlot,
  getNumberOfSlot,
  getSlotNotJoined,
} from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountdownTimer from "../../component/countDownTime";
import ComponentHeader from "../../component/Header/ComponentHeader";

function NewFeed({ inforWallet, tranPoint, yards, setActiveTab, clubDetail }) {
  const { id } = useParams();
  const { idclubmem } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [slotNotJoined, setSlotNotJoined] = useState([]);
  async function fetchData() {
    try {
      const [slotNotJoinedRes] = await Promise.all([
        getSlotNotJoined(idclubmem, id),
      ]);

      const slotNotJoinFilter = slotNotJoinedRes.result.filter((item) => {
        return (
          item.memberPostId != idclubmem &&
          !isPassTime(item.date, item.startTime)
        );
      });

      setSlotNotJoined(slotNotJoinFilter);

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
      console.log(postData);
      await createPostInSlot(postData);
      showSuccessToast("Create post successfully!");
      setIsModalOpen(false);
      setIsLoading(true);
      fetchData();
    } catch (error) {
      console.log(error);
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

  function isPassTime(date, hour) {
    const time = date + "T" + hour + ":00";
    const targetTime = new Date(time).getTime();
    const currentTime = new Date().getTime();

    if (targetTime < currentTime) {
      return true;
    } else {
      false;
    }
  }

  const date = new Date(clubDetail.dateTime);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const timePost = ` ${day}-${month}-${year}`;

  return (
    <>
    <ComponentHeader />
      <div className="new-feed-container">
        {/* <div className="club-title-new-feed">
          <img
            className="img-background"
            src={clubDetail.image}
            alt="club-background"
            style={{
              width: "28%",
              marginRight: "37px",
              borderRadius: "44%",
            }}
          ></img>
          <div>
            <p>{clubDetail.name}</p>
            <p>Số lượng thành viên {clubDetail.countMember}</p>
            <p>Ngày thành lập: {timePost}</p>
          </div>
        </div> */}
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
          const time = item.date + "T" + item.startTime + ":00";
  
          const date = new Date(item.dateTime);
  
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const timePost = ` ${hours}:${minutes} ${day}-${month}-${year}`;
  
          const remainingSlots =
            parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
          const isFull = remainingSlots <= 0;
  
          const yardDetails = yards.find((yard) => {
            return yard.id === item.yardId;
          });
  
          return (
            <div key={item.id} className="main-post-container">
              <div className="poster-name">
                <div>
                  <p
                    style={{
                      fontSize: "31px",
                    }}
                  >
                    {item.memberPostName}
                  </p>
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
                      <b>
                        Khu: <span>{yardDetails?.areaName}</span>{" "}
                      </b>
                    </div>
                    <div>
                      <b>
                        Sân:{" "}
                        <span>
                          {yardDetails?.sportName} - {item.yardName}
                        </span>
                      </b>
                    </div>
                    <div>
                      <b>
                        Thời gian:{" "}
                        <span>
                          {item.startTime} - {item.endTime}
                        </span>
                      </b>
                    </div>
                    <div>
                      <b>
                        Ngày: <span>{item.date}</span>
                      </b>
                    </div>
                    <div>
                      <b>
                        Tổng số người chơi:{" "}
                        <span>
                          {parseInt(item.requiredMember) +
                            parseInt(item.currentMember)}
                        </span>
                      </b>
                    </div>
                    <div>
                      <b>
                        Còn thiếu:{" "}
                        <span>
                          {parseInt(item.requiredMember) -
                            parseInt(numberOfSlot[item.id] || 0)}
                        </span>{" "}
                        người
                      </b>
                    </div>
                  </div>
                  {isFull ? (
                    <button
                      className="btn-join"
                      disabled
                      style={{ backgroundColor: "gray" }}
                    >
                      Đã đủ người
                    </button>
                  ) : (
                    <button
                      className="btn-join"
                      onClick={() => {
                        handleJoinSlot(item.id);
                      }}
                    >
                      Tham gia
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <ModalCreatePost
          clubDetail={clubDetail}
          isOpen={isModalOpen}
          toggle={toggleModal}
          createPost={handleCreatePost}
          setActiveTab={setActiveTab}
        />
      </div>
    </>
  );
}

export default NewFeed;
