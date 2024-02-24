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

function MyJoinPost() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [postIdJoined, setPostIdJoined] = useState([]);
  const [postJoined, setPostJoined] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [yardDetails, setYardDetails] = useState([]);

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
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const details = await Promise.all(
        postJoined.map((item) => getYardDetail(item.yardId))
      );
      setYardDetails(details);
    };

    fetchData();
  }, [postJoined]);

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
      <h5>Bài viết của bạn đã tham gia</h5>
      {postJoined.length === 0 ? (
        <div className="no-posts-message">
          Bạn chưa hoạt động tham gia, hãy tích cực tham gia nào
        </div>
      ) : (
        postJoined.map((resultItem, index) => (
          <div key={index} className="main-post-container">
            <div className="poster-name">
              <p>{resultItem.memberPostName}</p>
              <div>{resultItem.dateTime}</div>
            </div>
            <div className="caption">{resultItem.description}</div>
            <div className="post-content-container">
              <img className="post-img" src={resultItem.image} alt="avatar" />
              <div className="post-infor">
                <h3>Thông tin trận đấu bạn tham gia</h3>
                <div>
                  <div>
                    <b>Khu: {yardDetails[index]?.result.areaName} </b>
                  </div>
                  <div>
                    <b>
                      Sân: {yardDetails[index]?.result.sportName} -{" "}
                      {resultItem.yardName}
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
        ))
      )}
    </div>
  );
}

export default MyJoinPost;
