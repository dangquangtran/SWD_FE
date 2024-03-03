import React, { useEffect, useState } from "react";
import { getAllClubStaff } from "../../../services/staffService";
import "./MyClub.scss"

function MyClub() {
    const [clubs, setClubs] = useState(null);

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

    return (
        <div className="club-manage">
            {clubs && clubs.map(club => {
                return (
                    <div key={club.id} className="club-staff">
                        <img src={club.image} alt={`Club ${club.id}`} />
                        <h4>{club.name}</h4>
                    </div>
                )
            })}
        </div>
    )
}

export default MyClub