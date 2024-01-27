import './HeaderMember.scss';
import { useNavigate } from "react-router-dom";
import { handleLogoutMember } from '../../services/memberService';

function HeaderMember() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await handleLogoutMember();
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    const userInfo = localStorage.getItem('userInfo');
    return ( 
        <div className='body'>
            <div className="col-6 header-logo"></div>
            <div className="col-8 middle">
                <div className='content-middle'>
                    <div className='child-content'>
                        <div><b>Home</b></div>
                    </div>
                    <div className='child-content'>
                        <div><b>Club</b></div>
                    </div>
                    <div className='child-content'>
                        <div><b>Contact</b></div>
                    </div>
                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                </div>
            </div>
            <div className="col-5 content-right">
                <div className='header-image'></div>
                <div className='header-userInfo'>
                    {userInfo}
                </div>
                <button onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i></button>
            </div>
        </div>
    );
}


export default HeaderMember;