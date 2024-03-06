import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClub } from "../../services/userService";
import "./ClubContent.scss";

function ClubContent() {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchApiClubs();
  }, []);

  const fetchApiClubs = async () => {
    try {
      let data = await getAllClub();
      setClubs(data.result);
    } catch (error) {
      setClubs([]);
      console.log(error);
    }
  };

  const handleClick = (clubId) => {
    navigate(`/member-sport/${clubId}`);
  };

  return (
    <div className="container-club1">
      <div className="line"></div>
      <h1 className="club-title">Các câu lạc bộ thể thao</h1>
      <p className="sub-title">Hãy chọn câu lạc bộ mà bạn quan tâm nhé!</p>
      <div className="content-middle">
        {clubs &&
          clubs.map((item, index) => {
            if (item.status && item.status.data && item.status.data[0] === 1 && item.approveStatus === 1) {
              return (
                <div className="club" key={index}>
                  <img
                    alt="sport"
                    className="image-club"
                    onClick={() => handleClick(item.id)}
                    src={item.image}
                  />
                  <a className="club-name" onClick={() => handleClick(item.id)}>
                    CLB: {item.name}
                  </a>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default ClubContent;
