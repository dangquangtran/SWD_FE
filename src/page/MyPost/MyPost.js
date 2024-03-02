// MyPost.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";
import {
  getIdMemberCreatePost,
  getMyPostInClub,
  getNumberOfSlot,
  getTranPoint,
  getWalletByMemberId,
  getYardDetail,
} from "../../services/userService";
import {
  getListMemberJoinPost,
  confirmNoJoining,
  confirmJoining,
} from "../../services/memberService";
import "./MyPost.scss";

function MyPost() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [myPost, setMyPost] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [yardDetails, setYardDetails] = useState([]);
  const [memberJoinList, setMemberJoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tranPoint, setTranPoint] = useState(null);
  const [inforWallet, setInforWallet] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const details = await Promise.all(
        myPost.map((item) => getYardDetail(item.yardId))
      );
      setYardDetails(details);
    };

    fetchData();
  }, [myPost]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response1 = await getIdMemberCreatePost(userInfo.id, id);
        const memberCreatePostId = response1.result.id;

        const response2 = await getMyPostInClub(memberCreatePostId);
        setMyPost(response2.result);

        const response3Promises = response2.result.map(async (post) => {
          const response = await getListMemberJoinPost(post.id);
          return { postId: post.id, members: response.result, status: response.IdClubMemberSlots };
        });
        const response3Results = await Promise.all(response3Promises);
        setMemberJoinList(response3Results);

        const promises = response2.result.map(async (item) => {
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

        const tranPointRes = await getTranPoint();
        setTranPoint(tranPointRes.result);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    setIsLoading(true);
  }, [id, userInfo.id]);

  const handleConfirmJoin = async (idClubMember, idSlot) => {
    try {
      await confirmJoining(idClubMember, idSlot, {
        tranPoint: tranPoint,
        inforWallet: inforWallet
      });
      showSuccessToast('Confirm successful!');
    } catch (error) {
      console.log(error);
      showErrorToast('Confirm failed!');
    }
  };
  const handleCancelJoin = async (idClubMember, idSlot) => {
    try {
      await confirmNoJoining(idClubMember, idSlot)
      showSuccessToast('Cancel successful!');
    } catch (error) {
      showErrorToast('Cancel failed!');
    }
  };


  return (
    <div className="new-feed-container">
      <h5>Bài viết của bạn</h5>
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
      )}
      {myPost.length === 0 ? (
        <div className="no-posts-message">
          Bạn chưa đăng bài, hãy cùng kiếm đồng đội nhé
        </div>
      ) : (
        <>
          {myPost.map((item, index) => {
            return (
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
                    </div>
                  </div>
                </div>
                <div>
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
                  ) : (
                    <div className="member-join">
                      {memberJoinList
                        .filter((postItem) => postItem.postId === item.id)
                        .map((postItem) => (
                          <div key={postItem.postId} className="member-join-list">
                            <h4>Danh sách người chơi đã tham gia:</h4>
                            {postItem.members.length > 0 ? (
                              postItem.members.map((member) => (
                                <div key={member.id} className="member-item">
                                  <span>Người chơi muốn tham gia: {member.memberName}</span>{" "}
                                  <div>
                                    {postItem.status.map((status) => {
                                      if (status.clubMemberId === member.id) {
                                        if (status.joinStatus === "joined") {
                                          return (
                                            <div key={`${member.id}-joined`}>
                                              <button
                                                className='confirm-button'
                                                onClick={() => handleConfirmJoin(member.id, postItem.postId)}
                                              >
                                                Xác nhận đã tham gia
                                              </button>
                                              <button
                                                className="cancel-button"
                                                onClick={() => handleCancelJoin(member.id, postItem.postId)}
                                              >
                                                Xác nhận không tham gia
                                              </button>
                                            </div>
                                          )
                                        } else if (status.joinStatus === "confirm_joined") {
                                          return (
                                            <button
                                              key={`${member.id}-confirm-joined`}
                                              className='confirm-button'
                                            >
                                              Đã tham gia
                                            </button>
                                          )
                                        } else if (status.joinStatus === "confirm_no_joined") {
                                          return (
                                            <button
                                              key={`${member.id}-confirm-no-joined`}
                                              className='confirm-button'
                                            >
                                              Không tham gia
                                            </button>
                                          )
                                        }
                                      }
                                      return null;
                                    })}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div>Chưa có người chơi nào tham gia.</div>
                            )}
                          </div>
                        ))}


                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default MyPost;
