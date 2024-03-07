import React, { useEffect, useState } from "react";
import { getAllClubStaff } from "../../../services/staffService";
import { useNavigate } from "react-router-dom";
import "./MyClub.scss"

function MyClub() {
    const [clubs, setClubs] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const userID = JSON.parse(localStorage.getItem('userInfo')).id;
                const response = await getAllClubStaff(userID);
                setClubs(response.message);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSports();
    }, []);

    const handleClick = (clubId) => {
        navigate(`/member-sport/staff/${clubId}`);
    };

    return (
        <div className="club-manage">
            {clubs && clubs.map(club => {
                return (
                    <div key={club.id} className="club-staff" >
                        <div onClick={() => {
                            if (club.approveStatus === 1) {
                                handleClick(club.id)
                            }
                        }}> <img src={club.image} alt={`Club ${club.id}`} />
                            <h4>{club.name}</h4></div>
                        {club.approveStatus === 1 ? <div className="approved">approved</div> : club.approveStatus === 0 ? <div className="waiting">waiting...</div> : <div className="reject-club">Rejected</div>}
                        <div>
                            <button className="btn-myclub mem-list-btn" onClick={() => {
                            if (club.approveStatus === 1) {
                                handleClick(club.id)
                                }
                            }}>Thành viên</button>
                            <button className="btn-myclub delete-club-staff">Xóa club</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyClub