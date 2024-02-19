import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    checkMemberJoinClub,
    getDetailClub,
    MemberJoinClub,
    MemberLeavingClub,
    ClubMember
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
    
            const response2 = await checkMemberJoinClub(user.id, id);
            setIsJoined(response2.result == 1 ? true : false);
    
            const clubMembers = await ClubMember();
    
            const filteredMembers = clubMembers.result.filter(member => member.status.data[0] === 1 && member.clubId === parseInt(id));
    
            setClubDetail(prevClubDetail => ({
                ...prevClubDetail,
                countMember: filteredMembers.length
            }));
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

        setClubDetail(prevClubDetail => ({
            ...prevClubDetail,
            countMember: prevClubDetail.countMember + 1
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
            setIsLeaving(true);

            setClubDetail(prevClubDetail => ({
                ...prevClubDetail,
                countMember: prevClubDetail.countMember - 1
            }));
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
                <button className="  btn-back" onClick={() => navigate("/members")}> Back</button>

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
                                <button className="btn view-btn" onClick={() => navigate(`/main-club/${clubDetail.id}`)}>Tham quan</button>
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
