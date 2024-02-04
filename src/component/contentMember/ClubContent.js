import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import image1 from '../../assets/Sport/badminton.jpg'
import { getAllClub } from "../../services/userService";
import "./ClubContent.scss"

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
        <div className="container-club1">
            <div className="line"></div>
            <h1 className="club-title">Sport clubs</h1>
            {/* <div className="content-middle">
                {
                    clubs && clubs.map((item, index) => {
                        if (item.status && item.status.data && item.status.data[0] === 1) {
                            return (
                                //đang hard code hình ảnh đợi xử lí
                                <div className="clubs" key={index}>

                                    <img onClick={() => handleClick(item.id)} src={image1} style={{ cursor: 'pointer' }} />
                                    <a className="club-name" onClick={() => handleClick(item.id)}>Club Name: {item.name}</a>

                                </div>
                            )
                        }
                    })
                }
            </div> */}
            <div className="content-middle">
                <div className="club" onClick={() => navigate(`/member-sport/2`)}>
                    <img className="image-club" src={image1} />
                    <a className="club-name">Badminton club</a>
                </div>
                <div className="club" onClick={() => navigate(`/member-sport/2`)}>
                    <img className="image-club" src={image1} />
                    <a className="club-name">Basketball club</a>
                </div>
                <div className="club" onClick={() => navigate(`/member-sport/2`)}>
                    <img className="image-club" src={image1} />
                    <a className="club-name">Football club</a>
                </div>
            </div>
        </div>
    );
}

export default ClubContent;
