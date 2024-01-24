import React from 'react';
import './HeaderAdmin.scss';

function HeaderAdmin() {
    const userInfo = localStorage.getItem('userInfo');
    return ( 
        <div className='containerr'>
            <div className="col-3 header-logo"></div>
            <div className="col-8 middle">
                <div className='content-middle'>
                    <input type="text" className="header-search" placeholder='Enter' />
                    <div className='header-icon'>
                        <i class="fa fa-snowflake-o" aria-hidden="true"></i>
                        <i class="fa fa-bell-o" aria-hidden="true"></i>
                        <i class="fa fa-envelope-open-o" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className="col-2 content-right">
                <div className='header-image'></div>
                <div className='header-userInfo'>
                    {userInfo}
                </div>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
            </div>
        </div>
     );
}

export default HeaderAdmin;