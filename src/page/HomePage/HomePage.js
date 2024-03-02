import React from 'react';
import Button from '../../component/button/index';
import './HomePage.scss'
import Logo from '../../assets/logoHeader/logo.svg'

function HomePage() {
    return (

        <div className='container'>
            <h1>Welcome to Sports Club</h1>
            <div className='login-btn'>
                <Button loginbtn to={"/login-admin"}>
                    Login Admin
                </Button>
                <Button loginbtn to={"/login-staff"}>
                    Login Staff
                </Button>
                <Button loginbtn to={"/login-member"}>
                    Login Member
                </Button>
            </div>
            <div className='wc-img'></div>
        </div >
    );
}

export default HomePage;