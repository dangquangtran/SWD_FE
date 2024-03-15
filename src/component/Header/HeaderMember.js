import "./HeaderMember.scss";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleLogoutMember } from "../../services/memberService";
import HomeContent from "../contentMember/HomeContent";
import ClubContent from "../contentMember/ClubContent";

function HeaderMember() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTabFromLocation = location.state?.activeTab;

    const [activeTab, setActiveTab] = useState(activeTabFromLocation || "home");

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

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    return (
        <>
            <div className="body">
                <div className="col-6 header-logo"></div>
                <div className="col-8 middle">
                    <div className="content-middle-mem">
                        <div className={`child-content ${activeTab === "home" ? "active" : ""}`} onClick={() => handleTabClick("home")}>
                            <div>
                                <b style={{ cursor: 'pointer', fontSize: '28px' }}>Trang chủ</b>
                            </div>
                        </div>
                        <div className={`child-content ${activeTab === "club" ? "active" : ""}`} onClick={() => handleTabClick("club")}>
                            <div>
                                <b style={{ cursor: 'pointer', fontSize: '28px' }}>Câu lạc bộ</b>
                            </div>
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
            {activeTab === "home" && <HomeContent />}
            {activeTab === "club" && <ClubContent />}
        </>
    );
}

export default HeaderMember;
