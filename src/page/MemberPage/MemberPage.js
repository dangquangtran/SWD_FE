import HeaderMember from "../../component/Header/HeaderMember";
import React from "react";
import "./MemberPage.scss";
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
