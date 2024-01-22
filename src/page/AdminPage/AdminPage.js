import React, { useState } from "react";
import MemberManage from "./MemberManage";
import StaffManage from "./StaffManage";
import ClubManage from "./ClubManage";

function AdminPage() {
    const [selectedTab, setSelectedTab] = useState("member");

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

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

            {selectedTab === "member" && <MemberManage />}
            {selectedTab === "staff" && <StaffManage />}
            {selectedTab === "club" && <ClubManage />}
        </div>
    );
}

export default AdminPage;
