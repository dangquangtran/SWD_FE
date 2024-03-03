import React from 'react';
import Button from '../../component/button/index';
import './HomePage.scss'

function HomePage() {
    return (

        <div className='container'>
            <h1>Welcome to Sports Club</h1>
            <div className='login-btn'>
                <Button loginbtn to={"/login-admin"}>
                    Đăng nhập Admin
                </Button>
                <Button loginbtn to={"/login-staff"}>
                    Đăng nhập Staff
                </Button>
                <Button loginbtn to={"/login-member"}>
                    Đăng nhập Member
                </Button>
            </div>
            <div className='wc-img'></div>
        </div >
    );
}

export default HomePage;