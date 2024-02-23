import React, { useEffect, useState } from "react";
import './MyJoinPost.scss';
import {
    getIdMemberCreatePost,
    getSlotJoined,
    getSlotPostJoined
} from "../../services/userService";
import { useParams } from "react-router-dom";

function MyJoinPost() {
    const { id } = useParams();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [postIdJoined, setPostIdJoined] = useState([]);
    const [postJoined, setPostJoined] = useState([]);

    async function fetchData () {
        try {
            const memberCreatePostRes = await getIdMemberCreatePost(userInfo.id, id);
            const response1 =  await getSlotJoined(memberCreatePostRes.result.id);
            setPostIdJoined(response1.result);
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
                const slotIds = postIdJoined.map(item => item.slotId);
                const promises = slotIds.map(slotId => getSlotPostJoined(slotId));
                const responses2 = await Promise.all(promises);
                setPostJoined(responses2.map(response => response.result));
            } catch (error) {
                console.log(error);
            }
        }

        fetchPosts();
    }, [postIdJoined]);

    return ( 
        <div className="new-feed-container">
            <h5>Bài viết của bạn đã tham gia</h5>
            {postJoined.map((resultItem, index) => (
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
                                    <b>Sân: {resultItem.yardName}</b>
                                </div>
                                <div>
                                    <b>Thời gian: {resultItem.startTime} - {resultItem.endTime}</b>
                                </div>
                                <div>
                                    <b>Date: {resultItem.date}</b>
                                </div>
                                <div>
                                    <div>
                                        <b>Người chơi đang có: {resultItem.currentMember}</b>
                                    </div>
                                    <div>
                                        <b>Còn: {resultItem.requiredMember}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyJoinPost;
