import React from "react";
import { useNavigate } from "react-router-dom";
import { handleLogoutMember } from "../../services/memberService";

function ComponentHeader() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const handleClubClick = () => {
        navigate('/members', { state: { activeTab: 'club' } });
    };

    const handleLogout = async () => {
        try {
            await handleLogoutMember();
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return ( 
        <div className="body">
            <div className="col-6 header-logo"></div>
            <div className="col-8 middle">
                <div className="content-middle-mem">
                    <div>
                        <b style={{ cursor: 'pointer', fontSize: '28px' }} onClick={() => navigate('/members')}>Trang chủ</b>
                    </div>
                    <div>
                        <b style={{ cursor: 'pointer', fontSize: '28px' }} onClick={handleClubClick}>Câu lạc bộ</b>
                    </div>
                    <div className="child-content">
                        <div>
                            <b style={{ cursor: 'pointer', fontSize: '28px' }}>Hướng dẫn</b>
                        </div>
                    </div>
                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                </div>
            </div>
            <div className="col-5 content-right">
                <div className="header-image">
                    <img alt="avatar" src={userInfo.image} width={50} height={50} />
                </div>
                <div className="header-userInfo">{userInfo.name}</div>
                <button onClick={handleLogout}>
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}

export default ComponentHeader;
