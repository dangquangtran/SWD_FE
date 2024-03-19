import React from "react";
import './Footer.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from '@fortawesome/free-regular-svg-icons';



function Footer() {
    return (
        <div className="container-footer">
            <h2 className="footer-title">Thông tin liên hệ</h2>
            <div className="infor-footer">
                <div className="email">
                    Email: VHcourtbooking@gmail.com
                </div>
                <div className="phone"> Phone: 0123456789</div>
            </div>
            <p className="copyright"><FontAwesomeIcon className="copy-icon" icon={faCopyright} />Copyright 2024 VHcourtbooking.vn. Bản quyền thuộc về Racket</p>
        </div>
    );
}

export default Footer;