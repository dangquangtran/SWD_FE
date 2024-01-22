import React, { useEffect, useState } from "react";
import './LoginPage.scss'
import { handleLoginAdmin } from "../../services/userService";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [userName, setUserName] = useState('')
    const [passWord, setPassWord] = useState('')
    const [showPassWord, SetShowPasswords] = useState(false);
    const navigate = useNavigate();

    const handleShowHidePassword = () => {
        SetShowPasswords(!showPassWord);
    }

    const handleOnChangeUsername = (e) => {
        setUserName(e.target.value)
    }

    const handleOnChangePassword = (e) => {
        setPassWord(e.target.value)
    }

    const handleLogin = async () => {
        try {
            let data = await handleLoginAdmin(userName, passWord)
            if(data && !_.isEmpty(data.token)) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', data.user.username)
                window.location.href = '/admin';
            }
        } catch (error) {
            //chưa xử lí validate
            console.log(error);
        }
    }

    return ( 
        <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input 
                                type='text' 
                                className='form-control' 
                                placeholder='Enter your username'
                                value={userName}
                                onChange={handleOnChangeUsername}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input 
                                    type={showPassWord ? 'text' : 'password'}
                                    className='form-control' 
                                    placeholder='Enter your password'
                                    value={passWord}
                                    onChange={handleOnChangePassword}
                                />
                                <span onClick={() => handleShowHidePassword()}>
                                    {
                                        showPassWord ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i> 
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {/* {this.state.errMessage} */}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default LoginPage;