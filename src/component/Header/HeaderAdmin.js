import React from 'react';
import './HeaderAdmin.scss';
import { handleLogOut } from '../../services/userService';
import { useNavigate } from "react-router-dom";

function HeaderAdmin() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await handleLogOut();
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    const userInfo = localStorage.getItem('userInfo');
    return (
        <div className='containerr'>
            <div className="col-3 header-logo"></div>
            <div className="col-8 middle">
                <div className='content-middle'>
                    <input type="text" className="header-search" placeholder='Enter' />
                    <div className='header-icon'>
                        <i className="fa fa-snowflake-o" aria-hidden="true"></i>
                        <i className="fa fa-bell-o" aria-hidden="true"></i>
                        <i className="fa fa-envelope-open-o" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className="col-2 content-right">
                <div className='header-image'></div>
                <div className='header-userInfo'>
                    {userInfo}
                </div>
                <button onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i></button>
            </div>
        </div>
    );
}

export default HeaderAdmin;