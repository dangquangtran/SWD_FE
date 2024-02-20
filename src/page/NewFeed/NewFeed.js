import React, { useEffect, useState } from "react";
import "./NewFeed.scss";
import image1 from "../../assets/Sport/badminton.jpg";

import { getDetailClub, getPostInClub } from "../../services/userService";
import { useParams } from "react-router-dom";

function NewFeed() {
  const { id } = useParams();
  const userInfo = localStorage.getItem("userInfo");

  const [clubDetail, setClubDetail] = useState({});
  const [slotsInCluc, setSlotsInCluc] = useState([]);

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(id);
      setClubDetail(response.result);

      const response1 = await getPostInClub(id);
      setSlotsInCluc(response1.result);

      console.log(response1);
    } catch (error) {
      console.error("Error fetching club detail:", error);
    }
  };
  useEffect(() => {
    fetchClubDetail();
  }, []);

  return (
    <div className="new-feed-container">
      <div className="club-title-new-feed">{clubDetail.name}</div>
      <div className="post-container">
        <input className="post-input" placeholder="Tìm kiếm người chơi" />
        <div className="post-line"></div>
        <button className="write-btn">Viêt bài</button>
      </div>

      <h5>Bài viết mới nhất</h5>

      {slotsInCluc.map((item) => {
        if (item.memberPostId === userInfo.id) {
          return null;
        }
        return (
          <div key={item.id} className="main-post-container">
            <div className="poster-name">
              <p>{item.memberPostName}</p>
              <div>{item.dateTime}</div>
            </div>
            <div className="caption">Mình cần tìm.....</div>
            <div className="post-content-container">
              <img className="post-img" src={image1} />
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
                    <b>Date:</b>
                  </div>
                  <div>
                    <b>Số lượng: {item.requiredMember}</b>
                  </div>
                  <div>
                    <b>Còn: </b>
                  </div>
                </div>
                <button className="btn-join">Join</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NewFeed;
