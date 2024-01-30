import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import image1 from '../../assets/Sport/badminton.jpg'
import { getAllClub } from "../../services/userService";

function ClubContent() {
    const navigate = useNavigate();

    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        fetchApiClubs();
    }, []);

    const fetchApiClubs = async () => {
        try {
            let data = await getAllClub();
            // console.log(data.result[2].status.data);
            console.log(data);
            setClubs(data.result);
        } catch (error) {
            setClubs([]);
            console.log(error);
        }
    }

    const handleClick = (clubId) => {
        navigate(`/member-sport/${clubId}`);
    };
    

    return ( 
        <div className="img-club">
            <h2 className="join-title">Sport clubs</h2>
            <div className="content-middle">
            {
    clubs && clubs.map((item, index) => {
        if (item.status && item.status.data && item.status.data[0] === 1) {
            return (
                //đang hard code hình ảnh đợi xử lí
                <div key={index}>
                    <a onClick={() => handleClick(item.id)}>Club Name: {item.name}</a>
                    <img onClick={() => handleClick(item.id)} src={image1} style={{ cursor: 'pointer' }} /> 
                </div>
            )
        }
    })
}
            </div>
        </div>
    );
}

export default ClubContent;
