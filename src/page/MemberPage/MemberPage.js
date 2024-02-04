import HeaderMember from "../../component/Header/HeaderMember";
import React from "react";
import './MemberPage.scss'
import image from '../../assets/LogoHeaderMember/logo.jpg'

import image1 from '../../assets/Sport/badminton.jpg'
import image2 from '../../assets/Sport/football.jpg'
import image3 from '../../assets/Sport/ball.jpg'

import SportSlide from "./Section/Sport";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../component/Footer/Footer";

function MemberPage() {
    return (
        <div className="main">
            <HeaderMember />
            <Footer />
        </div>
    );
}

export default MemberPage;