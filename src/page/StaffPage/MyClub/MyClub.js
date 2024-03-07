import React, { useEffect, useState } from "react";
import { deleteClub, getAllClubStaff } from "../../../services/staffService";
import { useNavigate } from "react-router-dom";
import "./MyClub.scss"
import { showSuccessToast } from "../../../component/toast/toast";

function MyClub() {
    const [clubs, setClubs] = useState(null);
    const navigate = useNavigate();



    const fetchClubs = async () => {
        try {
            const userID = JSON.parse(localStorage.getItem('userInfo')).id;
            const response = await getAllClubStaff(userID);
            setClubs(response.message);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchClubs();
    }, []);

    const handleClick = (clubId) => {
        navigate(`/member-sport/staff/${clubId}`);
    };

    const handleDeleteClub = async (clubId) => {
        try {
            if (clubId) {
                await deleteClub(clubId);
                showSuccessToast('club deleted successfully!');
                await fetchClubs();
                console.log(clubId);
            }
        } catch (error) {
            console.log(error);
        }
    }


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
                            <button className="btn-myclub delete-club-staff" onClick={() => { handleDeleteClub(club.id) }}>Xóa club</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyClub