import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDetailClub } from "../../services/userService";
import "./ClubPage.scss"
import image1 from '../../assets/Sport/badminton.jpg'

function ClubPage() {
    const { id } = useParams();
    const [clubDetail, setClubDetail] = useState(null);

    const fetchClubDetail = async () => {
        try {
            const response = await getDetailClub(id);
            setClubDetail(response.result);
        } catch (error) {
            console.error("Error fetching club detail:", error);
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
                <h2>Câu lạc bộ <br />{clubDetail.name}</h2>
            </div>
            <div className="main-club">
                <div className="club-header">
                    <img className="img-background" src={image1} alt="club-background"></img>
                    <h2>Câu Lạc Bộ {clubDetail.name}</h2>
                    <p>{clubDetail.countMember} thành viên</p>
                    <div>
                        <button className="create-post">Create Post</button>
                        <button className="status">Đã tham gia</button>
                    </div>
                </div>

                <div className="post-content">
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
            </div>
        </div>
    );
}

export default ClubPage;
