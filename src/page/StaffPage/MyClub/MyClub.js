import React, { useEffect, useState } from "react";
import { deleteClub, getAllClubStaff } from "../../../services/staffService";
import { useNavigate } from "react-router-dom";
import "./MyClub.scss"
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import ModalClubInfo from "../../../component/modal/ModalClubInfo";

function MyClub() {
    const [clubs, setClubs] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null)

    const navigate = useNavigate();

    const toggleModal = (clubId) => {
        setIsModalOpen(!isModalOpen);
        const selectedClub = clubs.find(club => club.id === clubId);
        setSelectedClub(selectedClub);
    };

    const fetchClubs = async () => {
        try {
            const userID = JSON.parse(localStorage.getItem('userInfo')).id;
            const response = await getAllClubStaff(userID);
            setClubs(response.message);
            console.log(response)
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

    const handleDeleteClub = async (club) => {
        try {
            if (club && club.id) {
                await deleteClub(club.id);
                showSuccessToast('Club deleted successfully!');
                console.log(club)
                await fetchClubs();
            }
        } catch (error) {
            showErrorToast('Club delete error!');
            console.log(error);
        }
    }


    return (
        <div className="club-manage">
            {clubs && clubs.map(club => {
                if (club.status.data[0] === 1) {
                    return (
                        <div key={club.id} className="club-staff" >
                            <div onClick={() => toggleModal(club.id)}
                            > <img src={club.image} alt={`Club ${club.id}`} />
                                <h4>{club.name}</h4></div>
                            {club.approveStatus === 1 ? <div className="approved">approved</div> : club.approveStatus === 0 ? <div className="waiting">waiting...</div> : <div className="reject-club">Rejected</div>}
                            <ModalClubInfo
                                isOpen={isModalOpen}
                                toggleFromParent={() => toggleModal(selectedClub.id)}
                                data={selectedClub}
                            />
                            <div>
                                <button className="btn-myclub mem-list-btn" onClick={() => {
                                    if (club.approveStatus === 1) {
                                        handleClick(club.id)
                                    }
                                }}>Thành viên</button>
                                <button className="btn-myclub btn-post-club-staff">Bài viết</button>
                                <button className="btn-myclub delete-club-staff" onClick={() => { handleDeleteClub(club) }}>Xóa club</button>
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default MyClub