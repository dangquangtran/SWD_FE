import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkMeberJoinClub,
  getDetailClub,
  MemberJoinClub,
  MemberLeavingClub,
} from "../../services/userService";
import "./ClubPage.scss";
import image1 from "../../assets/Sport/badminton.jpg";

function ClubPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [clubDetail, setClubDetail] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); // Thêm state để theo dõi trạng thái rời club

  const user = JSON.parse(window.localStorage.getItem("userInfo"));

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(id);
      setClubDetail(response.result);
      // setIsJoined(response.result.status); // Cập nhật trạng thái tham gia từ API

      const response2 = await checkMeberJoinClub(user.id, id);
      setIsJoined(response2.result == 1 ? true : false);
    } catch (error) {
      console.error("Error fetching club detail:", error);
    }
  };

  const handleJoinClub = async () => {
    // Tạo yêu cầu tới API để tham gia câu lạc bộ
    // Nếu thành công, cập nhật state isJoined thành true

    const response = await MemberJoinClub({
      memberId: user.id,
      memberName: user.name,
      clubId: clubDetail.id,
      clubName: clubDetail.name,
    });

    setIsJoined(true);
  };

  const handleLeaveClub = async () => {
    // Hiển thị hộp thoại xác nhận khi muốn rời club
    const confirmLeave = window.confirm("Bạn có chắc chắn muốn rời club?");
    if (confirmLeave) {
      // Gửi yêu cầu tới API để rời club và cập nhật trạng thái isJoined
      const respone = await MemberLeavingClub({
        memberId: user.id,
        clubId: id,
      });
      setIsJoined(false);
      setIsLeaving(true);
      console.log(respone);
      // Gọi API để rời club và xử lý kết quả
      // Sau đó, setIsLeaving(false);
    }
  };

  useEffect(() => {
    fetchClubDetail();
  }, [id]);

  if (!clubDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-club">
      <div className="side-bar">
        <button onClick={() => navigate("/members")}>Quay lại</button>
        <h2>
          Câu lạc bộ <br />
          {clubDetail.name}
        </h2>
      </div>
      <div className="main-club">
        <div className="club-header">
          <img
            className="img-background"
            src={image1}
            alt="club-background"
          ></img>
          <h2>Câu Lạc Bộ {clubDetail.name}</h2>
          <p>{clubDetail.countMember} thành viên</p>
          <div>
            {isJoined ? (
              <div>
                <button className="status">Tham quan</button>
                <button className="status" onClick={handleLeaveClub}>
                  Muốn rời nhóm
                </button>
              </div>
            ) : (
              <button className="status" onClick={handleJoinClub}>
                Tham gia
              </button>
            )}
          </div>
        </div>

        {isJoined && (
          <div className="post-content">
            {/* Hiển thị danh sách các bài post ở đây */}
            <div className="content-post">
              <img className="img-post" src={image1}></img>
              <div className="post">
                <p>Mình có đặt sân cầu lông đang cần 2 members chơi ......</p>
                <div className="infor-post">
                  <h5>Thông tin trận đấu</h5>
                  <div>Sân: </div>
                  <div>Thời gian: </div>
                  <div>Số lượng: </div>
                  <div>Còn: </div>
                </div>
              </div>
            </div>
            <div className="content-post">
              <img className="img-post"></img>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubPage;
