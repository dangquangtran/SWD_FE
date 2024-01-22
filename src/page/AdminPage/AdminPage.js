import React, { useState } from "react";
import MemberManage from "./MemberManage";
import StaffManage from "./StaffManage";
import ClubManage from "./ClubManage";
import { handleLogOut } from "../../services/userService";

function AdminPage() {
    const [selectedTab, setSelectedTab] = useState("member");

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const LogoutHandle = async () => {
        try {
            await handleLogOut();
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        } catch (error) {
            console.error('Đăng xuất thất bại', error);
        }
    }

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li style={{ cursor: 'pointer' }} onClick={() => handleTabChange("member")}>Quản lý member</li>
                        <li style={{ cursor: 'pointer' }} onClick={() => handleTabChange("staff")}>Quản lý staff</li>
                        <li style={{ cursor: 'pointer' }} onClick={() => handleTabChange("club")}>Quản lý club</li>
                    </ul>
                </nav>
            </header>
        <button onClick={LogoutHandle}>Logout</button>
            {selectedTab === "member" && <MemberManage />}
            {selectedTab === "staff" && <StaffManage />}
            {selectedTab === "club" && <ClubManage />}
        </div>
    );
}

export default AdminPage;
