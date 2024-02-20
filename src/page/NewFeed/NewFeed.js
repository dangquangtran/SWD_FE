import React, { useEffect, useState } from "react";
import "./NewFeed.scss";
import image1 from "../../assets/Sport/badminton.jpg";

import { getDetailClub, getPostInClub, createPostInSlot, getIdMemberCreatePost } from "../../services/userService";
import { useParams } from "react-router-dom";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

function NewFeed() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [clubDetail, setClubDetail] = useState({});
  const [slotsInClub, setSlotsInClub] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberCreatePostId, setMemberCreatePostId] = useState('')

  useEffect(() => {
    fetchClubDetail();
    fetchMemberCreatePostId();
  }, []);

  const fetchMemberCreatePostId = async () => {
    try {
      const response = await getIdMemberCreatePost(userInfo.id, id);
      setMemberCreatePostId(response.result.id); 
    } catch (error) {
      console.error("Error fetching member create post id:", error);
    }
  };

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(id);
      setClubDetail(response.result);

      const response1 = await getPostInClub(id);
      setSlotsInClub(response1.result);

      console.log(response1);
    } catch (error) {
      console.error("Error fetching club detail:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreatePost = async (postData) => {
    postData.memberPostName = userInfo.name;
    postData.clubId = id;
    postData.memberPostId = isMemberCreatePostId;
    try {
      await createPostInSlot(postData);
      showSuccessToast('Create post successfully!');
      setIsModalOpen(false);
      fetchClubDetail();
    } catch (error) {
      showErrorToast('Create post error!');
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="new-feed-container">
      <div className="club-title-new-feed">{clubDetail.name}</div>
      <div className="post-container">
        <img alt="avatar" src={userInfo.image} />
        <button className="write-btn" onClick={toggleModal}>
          <span>{userInfo.name} ơi</span> 
          <span style={{ marginLeft: '5px' }}>Bạn đang muốn gì thế?</span>
        </button>
      </div>

      <h5>Bài viết mới nhất</h5>

      {slotsInClub.map((item) => {
        if (item.memberPostId === userInfo.id) {
          return null;
        }
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
      <ModalCreatePost isOpen={isModalOpen} toggle={toggleModal} createPost={handleCreatePost} />
    </div>
  );
}

export default NewFeed;
