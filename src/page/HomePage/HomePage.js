import React from 'react';
import Button from '../../component/button/index';
import './HomePage.scss'
import Logo from '../../assets/logoHeader/logo.svg'

function HomePage() {
    return ( 
        <div>
            <Button to={"/login-admin"}>
                Login Admin
            </Button>
            <Button to={"/login-member"}>
                Login Member
            </Button>
        </div>
    );
}

export default HomePage;