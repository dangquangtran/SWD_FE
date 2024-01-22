import React, { useState } from "react";
import MemberManage from "./MemberManage";
import StaffManage from "./StaffManage";

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
                    </ul>
                </nav>
            </header>

            {selectedTab === "member" && <MemberManage />}
            {selectedTab === "staff" && <StaffManage />}
        </div>
    );
}

export default AdminPage;
