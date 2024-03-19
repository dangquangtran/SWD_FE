import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  getIdMemberCreatePost,
  getMyPostInClub,
  getNumberOfSlot,
} from "../../../services/userService";
import { getListMemberJoinPost } from "../../../services/memberService";
import CountdownTimer from "../../../component/countDownTime";
import ComponentHeader from "../../../component/Header/ComponentHeader";

function MyPostNotDone({ yards, clubDetail, myPostInClub }) {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [memberJoinList, setMemberJoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myPostInClubFilter, setMyPostInClubFilter] = useState(myPostInClub);

  useEffect(() => {
    async function fetchData() {
      try {
        setMyPostInClubFilter(
          myPostInClub.filter((item, index) => {
            const time = item.date + "T" + item.startTime + ":00";
            const targetTime = new Date(time).getTime();
            const currentTime = new Date().getTime();

            return targetTime > currentTime;
          })
        );

        console.log(myPostInClub);

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

        const promises = myPostInClubFilter.map(async (item) => {
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

  const date = new Date(clubDetail.dateTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const timePost = ` ${day}-${month}-${year}`;

  return (
    <>
      <ComponentHeader />
      <div className="new-feed-container">
        <h5 style={{ marginTop: "100px", fontSize: '28px' }}>Bài viết của bạn chưa kết thúc</h5>
        {isLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="loading-icon"
            style={{ marginTop: "50px" }}
          />
        )}
        {myPostInClubFilter.length === 0 ? (
          <div className="no-posts-message">
            Bạn chưa đăng bài, hãy cùng kiếm đồng đội nhé
          </div>
        ) : (
          <>
            {myPostInClubFilter.map((item, index) => {
              const time = item.date + "T" + item.startTime + ":00";

              // Nếu thời gian chưa qua, hiển thị các thành phần bên dưới
              const date = new Date(item.dateTime);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

              //get yard details
              const yardDetails = yards.find((yard) => {
                return yard.id === item.yardId;
              });

              return (
                <div key={item.id} className="main-post-container">
                  <div className="poster-name">
                    <div>
                      <p>{item.memberPostName}</p>
                      <div>{timePost}</div>
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
                        <div className="item-infor">
                          <p>
                            Khu:{" "}
                            <span style={{ fontWeight: "600" }}>
                              <b> {yardDetails?.areaName}</b>
                            </span>
                          </p>
                        </div>
                        <div className="item-infor">

                          Sân:<b> {yardDetails?.sportName} - {item.yardName}
                          </b>
                        </div>
                        <div className="item-infor">

                          Thời gian: <b>{item.startTime} - {item.endTime}
                          </b>
                        </div>
                        <div className="item-infor">
                          Date: <b>{item.date}</b>
                        </div>
                        <div>
                          <div className="item-infor">

                            Tổng số người chơi:{" "}<b>
                              {parseInt(item.requiredMember) +
                                parseInt(item.currentMember)}
                            </b>
                          </div>
                          <div className="item-infor">

                            Còn:{" "}<b>
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

export default MyPostNotDone;
