import React, { useEffect, useState } from "react";
import "./MyJoinPost.scss";
import {
  getIdMemberCreatePost,
  getNumberOfSlot,
  getSlotJoined,
  getSlotPostJoined,
  getYardDetail,
} from "../../services/userService";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CountdownTimer from "../../component/countDownTime";

function MyJoinPost({ yards, clubDetail }) {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [postIdJoined, setPostIdJoined] = useState([]);
  const [postJoined, setPostJoined] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  async function fetchData() {
    try {
      const memberCreatePostRes = await getIdMemberCreatePost(userInfo.id, id);
      const response1 = await getSlotJoined(memberCreatePostRes.result.id);
      setPostIdJoined(response1.result);
      console.log(response1.result);

      const promises = response1.result.map(async (item) => {
        const response = await getNumberOfSlot(item.slotId);
        return {
          itemId: item.id,
          numberOfSlot: response.result,
          slotId: item.slotId,
        };
      });

      const results = await Promise.all(promises);
      const numberOfSlotMap = {};
      console.log(results);
      results.forEach((result) => {
        numberOfSlotMap[result.slotId] = result.numberOfSlot;
      });
      setNumberOfSlot(numberOfSlotMap);

      setIsLoadingData(false);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      if (postIdJoined.length === 0) return;

      try {
        const slotIds = postIdJoined.map((item) => item.slotId);
        const promises = slotIds.map((slotId) => getSlotPostJoined(slotId));
        const responses2 = await Promise.all(promises);
        setPostJoined(responses2.map((response) => response.result));
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, [postIdJoined]);

  return (
    <div className="new-feed-container">
      <div className="club-title-new-feed">
        <span>{clubDetail.name}</span>
      </div>
      <h5>Bài viết của bạn đã tham gia</h5>
      {isLoadingData && (
        <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
      )}
      {postJoined.length === 0 ? (
        <div className="no-posts-message">
          Bạn chưa hoạt động tham gia, hãy tích cực tham gia nào
        </div>
      ) : (
        postJoined.map((resultItem, index) => {
          const time = resultItem.date + "T" + resultItem.startTime + ":00";
          const targetTime = new Date(time).getTime();
          const currentTime = new Date().getTime();

          const date = new Date(resultItem.dateTime);

          const day = date.getDate(); // Lấy ngày trong tháng (1-31)
          const month = date.getMonth() + 1; // Lấy tháng (0-11), cộng thêm 1 vì tháng bắt đầu từ 0
          const year = date.getFullYear(); // Lấy năm
          const hours = date.getHours(); // Lấy giờ trong ngày (0-23)
          const minutes = date.getMinutes(); // Lấy phút (0-59)
          const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

          if (targetTime < currentTime) {
            return null;
          }

          //get yard details
          const yardDetails = yards.find((yard) => {
            return yard.id === resultItem.yardId;
          });
          return (
            <div key={index} className="main-post-container">
              <div className="poster-name">
                <p>{resultItem.memberPostName}</p>
                <div>{timePost}</div>
                <CountdownTimer targetTime={time} />
              </div>
              <div className="caption">{resultItem.description}</div>
              <div className="post-content-container">
                <img className="post-img" src={resultItem.image} alt="avatar" />
                <div className="post-infor">
                  <h3>Thông tin trận đấu bạn tham gia</h3>
                  <div>
                    <div>
                      <b>Khu: {yardDetails?.areaName} </b>
                    </div>
                    <div>
                      <b>
                        Sân: {yardDetails?.sportName} - {resultItem.yardName}
                      </b>
                    </div>
                    <div>
                      <b>
                        Thời gian: {resultItem.startTime} - {resultItem.endTime}
                      </b>
                    </div>
                    <div>
                      <b>Date: {resultItem.date}</b>
                    </div>
                    <div>
                      <div>
                        <b>
                          Tổng số người chơi:{" "}
                          {parseInt(resultItem.requiredMember) +
                            parseInt(resultItem.currentMember)}
                        </b>
                      </div>
                      <div>
                        <b>
                          Còn:{" "}
                          {resultItem.requiredMember -
                            parseInt(numberOfSlot[resultItem.id]) || 0}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyJoinPost;
