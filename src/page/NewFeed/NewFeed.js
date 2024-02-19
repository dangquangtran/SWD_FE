import React, { useState } from "react";
import "./NewFeed.scss";
import image1 from "../../assets/Sport/badminton.jpg";


function NewFeed() {

    return (
        <div className="new-feed-container">
            <div className="club-title-new-feed">CLB Cầu Lông</div>
            <div className="post-container">
                <input className="post-input" placeholder="Tìm kiếm người chơi" />
                <div className="post-line"></div>
                <button className="write-btn">Viêt bài</button>
            </div>

            <h5>Bài viết mới nhất</h5>

            <div className="main-post-container">
                <div className="poster-name"><p>Truc</p><div>posted time</div></div>
                <div className="caption">Mình cần tìm.....</div>
                <div className="post-content-container">
                    <img className="post-img" src={image1} />
                    <div className="post-infor">
                        <h3>Thông tin trận đấu</h3>
                        <div>
                            <div><b>Sân:</b></div>
                            <div><b>Thời gian:</b></div>
                            <div><b>Số lượng:</b></div>
                            <div><b>Còn: </b></div>
                        </div>
                        <button className="btn-join">Join</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default NewFeed;