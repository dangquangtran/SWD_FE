import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkMemberJoinClub,
  getDetailClub,
  MemberJoinClub,
  MemberLeavingClub,
  getIdMemberCreatePost,
} from "../../services/userService";
import "./ClubPage.scss";
import { showSuccessToast } from "../../component/toast/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

function ClubPage() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const { id } = useParams();
  const [clubDetail, setClubDetail] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [memberCreatePostId, setMemberCreatePostId] = useState(null);

  const user = JSON.parse(window.localStorage.getItem("userInfo"));

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(id);
      setClubDetail(response.result);
      console.log(response.result);

      const response2 = await checkMemberJoinClub(user.id, id);
      setIsJoined(response2.result == 1 ? true : false);

      if (response2.result == 1) {
        const memberCreatePostRes = await getIdMemberCreatePost(
          userInfo.id,
          id
        );
        setMemberCreatePostId(memberCreatePostRes.result.id);
      }
    } catch (error) {
      console.error("Error fetching club detail:", error);
    }
  };

  const handleJoinClub = async () => {
    await MemberJoinClub({
      memberId: user.id,
      memberName: user.name,
      clubId: clubDetail.id,
      clubName: clubDetail.name,
    });

    setIsJoined(true);
    showSuccessToast("Join Club Success");
    setClubDetail((prevClubDetail) => ({
      ...prevClubDetail,
      countMember: prevClubDetail.countMember + 1,
    }));

  };

  const handleLeaveClub = async () => {
    const confirmLeave = window.confirm("Bạn có chắc chắn muốn rời club?");
    if (confirmLeave) {
      await MemberLeavingClub({
        memberId: user.id,
        clubId: id,
      });
      setIsJoined(false);

      setClubDetail((prevClubDetail) => ({
        ...prevClubDetail,
        countMember: prevClubDetail.countMember - 1,
      }));
    }
  };

  useEffect(() => {
    fetchClubDetail();
  }, [id]);

  if (!clubDetail) {
    return <div>Loading...</div>;
  }

  const date = new Date(clubDetail.dateTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const timePost = `  ${day}-${month}-${year}`;

  return (
    
    <div className="container-club">
      <div className="side-bar">
        <button className="  btn-back" onClick={() => navigate("/members")}>
          {" "}
          <FontAwesomeIcon icon={faHouse} />
        </button>

        <h2>
          Câu lạc bộ <br />
          {clubDetail.name}
        </h2>
      </div>
      <div className="main-club">
        <div className="club-header">
          <img
            className="img-background"
            src={clubDetail.image}
            alt="club-background"
          ></img>
          <h2> {clubDetail.name}</h2>
          <p>{clubDetail.countMember} thành viên</p>
          <span>Ngày thành lập: {timePost}</span>
          <br></br>
          <span>Người quản lí: Staff1{clubDetail.staffName}</span>
          <div>
            {isJoined ? (
              <div>
                <button
                  className="btn view-btn"
                  onClick={() =>
                    navigate(
                      `/main-club/${clubDetail.id}/${memberCreatePostId}`
                    )
                  }
                >
                  Tham quan
                </button>
                <button className="btn leave-btn" onClick={handleLeaveClub}>
                  Muốn rời nhóm
                </button>
              </div>
            ) : (
              <button className="btn join-btn" onClick={handleJoinClub}>
                Tham gia
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubPage;
