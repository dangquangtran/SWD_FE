import React from 'react';
import Button from '../../component/button/index';
import './HomePage.scss'
import Logo from '../../assets/logoHeader/logo.svg'

function HomePage() {
    return ( 
        <div className='body'>
            <div className='header'>
                <div className='col-3 header-logo'>
                    <img className='logo' src={Logo} />
                </div>
                <div className='col-6'>
                    Hello
                </div>
                <div className='col-3'>
                    c
                </div>
            </div>
        </div>
    );
}

export default HomePage;