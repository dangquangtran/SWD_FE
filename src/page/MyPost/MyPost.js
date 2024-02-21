import React, { useEffect, useState } from "react";
import { getIdMemberCreatePost, getMyPostInClub } from "../../services/userService";
import { useParams } from "react-router-dom";
import image1 from "../../assets/Sport/badminton.jpg";
import "./MyPost.scss";

function MyPost() {
    const { id } = useParams();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [myPost, setMyPost] = useState([]);
    const [numberOfSlot, setNumberOfSlot] = useState();
    const [isMemberCreatePostId, setMemberCreatePostId] = useState(null);

    async function fetchData() {
        try {
            const response1 = await getIdMemberCreatePost(userInfo.id, id);
            setMemberCreatePostId(response1.result.id);

            const response2 = await getMyPostInClub(isMemberCreatePostId);
            setMyPost(response2.result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    })

    return ( 
        <div className="new-feed-container">
            <h5>Bài viết của bạn</h5>
            {myPost.map((item) => {
        

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
                    <div>
                        <b>Người chơi đang có: {item.currentMember}</b>  
                    </div>
                    {/* khúc này làm vội khúc người chơi tại đang chuyển nhà */}
                    <div>
                        <b>Còn: {item.requiredMember}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
        </div>
    );
}

export default MyPost;