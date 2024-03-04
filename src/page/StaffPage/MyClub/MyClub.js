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
                console.log(response.message)
            } catch (error) {
                console.log(error);
            }
        };

        fetchSports();
    }, []);

    const handleClick = (clubId) => {
        navigate(`/member-sport/${clubId}`);
    };

    return (
        <div className="club-manage">
            {clubs && clubs.map(club => {
                return (
                    <div key={club.id} className="club-staff" onClick={() => handleClick(club.id)}>
                        <img src={club.image} alt={`Club ${club.id}`} />
                        <h4>{club.name}</h4>
                    </div>
                )
            })}
        </div>
    )
}

export default MyClub