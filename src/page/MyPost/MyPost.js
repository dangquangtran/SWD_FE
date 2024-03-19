import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";
import {
  getIdMemberCreatePost,
  getMyPostInClub,
  getNumberOfSlot,
} from "../../services/userService";
import {
  getListMemberJoinPost,
  confirmNoJoining,
  confirmJoining,
} from "../../services/memberService";
import "./MyPost.scss";
import CountdownTimer from "../../component/countDownTime";
import ComponentHeader from "../../component/Header/ComponentHeader";

function MyPost({
  tranPoint,
  inforWallet,
  yards,
  clubDetail,
  setMyPostInClub,
  myPostInClub,
}) {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [memberJoinList, setMemberJoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response1 = await getIdMemberCreatePost(userInfo.id, id);
        const memberCreatePostId = response1.result.id;

        const response2 = await getMyPostInClub(memberCreatePostId);
        setMyPostInClub(response2.result);

        const response3Promises = response2.result.map(async (post) => {
          const response = await getListMemberJoinPost(post.id);
          return {
            postId: post.id,
            members: response.result,
            status: response.IdClubMemberSlots,
          };
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

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    setIsLoading(true);
  }, [id, userInfo.id]);

  const handleConfirmJoin = async (idClubMember, idSlot, memberId) => {
    try {
      await confirmJoining(idClubMember, idSlot, {
        tranPoint: tranPoint,
        inforWallet: inforWallet,
        memberId: memberId,
      });

      const response3Promises = myPostInClub.map(async (post) => {
        const response = await getListMemberJoinPost(post.id);
        return {
          postId: post.id,
          members: response.result,
          status: response.IdClubMemberSlots,
        };
      });

      const response3Results = await Promise.all(response3Promises);
      setMemberJoinList(response3Results);

      showSuccessToast("Xác nhận tham gia thành công!");
    } catch (error) {
      console.log(error);
      showErrorToast("Xác nhận tham gia thất bại");
    }
  };

  const handleCancelJoin = async (idClubMember, idSlot) => {
    try {
      await confirmNoJoining(idClubMember, idSlot);
      const response3Promises = myPostInClub.map(async (post) => {
        const response = await getListMemberJoinPost(post.id);
        return {
          postId: post.id,
          members: response.result,
          status: response.IdClubMemberSlots,
        };
      });

      const response3Results = await Promise.all(response3Promises);
      setMemberJoinList(response3Results);
      showSuccessToast("Xác nhận không tham gia thành công");
    } catch (error) {
      showErrorToast("Xác nhận không tham gia thất bại");
    }
  };

  const date = new Date(clubDetail.dateTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const timePost = ` ${day}-${month}-${year}`;

  console.log(myPostInClub);

  return (
    <>
      <ComponentHeader />
      <div className="new-feed-container">
        <h5 style={{ marginTop: "100px", fontSize: '28px' }}>Bài viết của bạn</h5>
        {isLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="loading-icon"
            style={{ marginTop: "50px" }}
          />
        )}
        {myPostInClub.length === 0 ? (
          <div className="no-posts-message">
            Bạn chưa đăng bài, hãy cùng kiếm đồng đội nhé
          </div>
        ) : (
          <>
            {myPostInClub.map((item, index) => {
              const time = item.date + "T" + item.startTime + ":00";
              const targetTime = new Date(time).getTime();
              const currentTime = new Date().getTime();

              var isPassTime = false;

              if (targetTime < currentTime) {
                isPassTime = true;
              }

              const date = new Date(item.dateTime);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

              //get yard details
              const yardDetails = yards.find((yard) => {
                console.log(yard);
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
                      <div>{timePost}</div>
                    </div>
                    {!isPassTime ? (
                      <div>
                        <CountdownTimer targetTime={time} />
                      </div>
                    ) : (
                      <p>Trận đấu đã kết thúc</p>
                    )}
                  </div>

                  <div className="caption">{item.description}</div>

                  <div className="post-content-container">
                    <img className="post-img" src={item.image} alt="avatar" />
                    <div className="post-infor">
                      <h3>Thông tin trận đấu</h3>
                      <div>
                        <div>
                          <b>
                            Khu:{" "}
                            <span style={{ fontWeight: "600" }}>
                              {yardDetails?.areaName}
                            </span>{" "}
                          </b>
                        </div>
                        <div>
                          <b>
                            Sân: {yardDetails?.sportName} - {item.yardName}
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
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="loading-icon"
                      />
                    ) : (
                      <div className="member-join">
                        {memberJoinList
                          .filter((postItem) => postItem.postId === item.id)
                          .map((postItem) => (
                            <div
                              key={postItem.postId}
                              className="member-join-list"
                            >
                              <h4>Danh sách người chơi đã tham gia:</h4>
                              {postItem.members.length > 0 ? (
                                postItem.members.map((member) => (
                                  <div key={member.id} className="member-item">
                                    <span>{member.memberName}</span>{" "}
                                    <div>
                                      {isPassTime &&
                                        postItem.status.map((status) => {
                                          if (
                                            status.clubMemberId === member.id
                                          ) {
                                            if (
                                              status.joinStatus === "joined"
                                            ) {
                                              return (
                                                <div
                                                  key={`${member.id}-joined`}
                                                >
                                                  <button
                                                    className="confirm-button"
                                                    onClick={() =>
                                                      handleConfirmJoin(
                                                        member.id,
                                                        item.id,
                                                        member.memberId
                                                      )
                                                    }
                                                  >
                                                    Xác nhận đã tham gia
                                                  </button>
                                                  <button
                                                    className="cancel-button"
                                                    onClick={() =>
                                                      handleCancelJoin(
                                                        member.id,
                                                        item.id
                                                      )
                                                    }
                                                  >
                                                    Xác nhận không tham gia
                                                  </button>
                                                </div>
                                              );
                                            } else if (
                                              status.joinStatus ===
                                              "confirm_joined"
                                            ) {
                                              return (
                                                <button
                                                  key={`${member.id}-confirm-joined`}
                                                  className="confirm-button"
                                                >
                                                  Đã tham gia
                                                </button>
                                              );
                                            } else if (
                                              status.joinStatus ===
                                              "confirm_no_joined"
                                            ) {
                                              return (
                                                <button
                                                  key={`${member.id}-confirm-no-joined`}
                                                  className="cancel-button"
                                                >
                                                  Không tham gia
                                                </button>
                                              );
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
    </>
  );
}

export default MyPost;
