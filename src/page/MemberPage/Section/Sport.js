// Import các thư viện và file CSS cần thiết
import React from "react";
import Slider from 'react-slick';
import './Sport.scss'

function SportSlide() {
    // Đặt cài đặt cho Slider
    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    return (
        <div className='section-share section-hand-book'>
            <div className='section-container'>
                <div className='section-header'>
                    <h2 className='title-section'>Một số hình ảnh</h2>
                    {/* <button className='btn-section'><span className='btn-section-item'>Xem thêm</span></button> */}
                </div>
                <div className='section-body'>
                    <Slider {...settings}>
                        <div className='section-customize'>
                            <div className='bg-image basket-img'></div>
                            <div>Sân bóng rổ</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-image soccer-img'></div>
                            <div>Sân bóng đá</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-image badminton-img'></div>
                            <div>Sân cầu lông</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-image tennis-img'></div>
                            <div>Sân tennis</div>
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default SportSlide;
