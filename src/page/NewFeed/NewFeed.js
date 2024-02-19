import React, { useState } from "react";
import "./NewFeed.scss"

function NewFeed() {

    return (
        <div className="new-feed-container">
            <div className="club-title-new-feed">CLB xxx</div>
            <div className="post-container">
                <input className="post-input" placeholder="Tìm kiếm người chơi" />
                <div className="post-line"></div>
                <button className="write-btn">Viêt bài</button>
            </div>

            <h5>Bài viết mới nhất</h5>

            <div className="main-post-container">
                <div className="poster-name"><p>Truc</p></div>
                <div className="caption">mình cần tìm.....</div>
            </div>
        </div>
    )

}

export default NewFeed;