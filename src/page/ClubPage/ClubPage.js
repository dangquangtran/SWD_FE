import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDetailClub } from "../../services/userService";

function ClubPage() {
    const { id } = useParams();
    const [clubDetail, setClubDetail] = useState(null);

    const fetchClubDetail = async () => {
        try {
            const response = await getDetailClub(id);
            setClubDetail(response.result); 
        } catch (error) {
            console.error("Error fetching club detail:", error);
        }
    };

    useEffect(() => {
        fetchClubDetail();
    }, [id]);

    if (!clubDetail) {
        return <div>Loading...</div>;
    }

    return ( 
        <div>
            <h1>Name Club: {clubDetail.name}</h1>
            <p>Member Count: {clubDetail.countMember}</p>
        </div>
    );
}

export default ClubPage;
