import React, { useEffect, useState } from "react";
import { getIdMemberCreatePost, getMyPostInClub } from "../../services/userService";
import { useParams } from "react-router-dom";
import "./MyPost.scss";

function MyPost() {
    const { id } = useParams();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [myPost, setMyPost] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response1 = await getIdMemberCreatePost(userInfo.id, id);
                const memberCreatePostId = response1.result.id;
                
                const response2 = await getMyPostInClub(memberCreatePostId);
                setMyPost(response2.result);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [id, userInfo.id]);

    return ( 
        <div className="new-feed-container">
        <h5>Bài viết của bạn</h5>
        {myPost.length === 0 ? (
            <div className="no-posts-message">
                Bạn chưa đăng bài, hãy cùng kiếm đồng đội nhé
            </div>
        ) : (
            <>
                {myPost.map((item) => (
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
                                        <b>Thời gian: {item.startTime} - {item.endTime}</b>
                                    </div>
                                    <div>
                                        <b>Date: {item.date}</b>
                                    </div>
                                    <div>
                                        <div>
                                            <b>Người chơi đang có: {item.currentMember}</b>  
                                        </div>
                                        <div>
                                            <b>Còn: {item.requiredMember}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )}
    </div>
    );
}

export default MyPost;
