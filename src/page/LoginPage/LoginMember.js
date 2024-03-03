import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleLoginMember, registerMember } from "../../services/memberService";
import './LoginPage.scss';
import _ from "lodash";
import ModalRegisterMember from "../../component/modal/ModalRegisterMember";
import { showSuccessToast } from "../../component/toast/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const LoginMember = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            userName: '',
            passWord: '',
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Username is required'),
            passWord: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                let data = await handleLoginMember(values.userName, values.passWord);
                console.log(data);
                if (data && !_.isEmpty(data.token)) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userInfo', JSON.stringify(data.user));
                    window.location.href = '/members';
                }
            } catch (error) {
                console.error(error);
                setErrors({ general: 'An error occurred during login.' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const doCreateNewUser = async (data) => {
        try {
            await registerMember(data)
            showSuccessToast('User added successfully!');
            setIsModalOpen(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='login-background'>
            <div className='login-container'>
                <div className='login-content row'>
                    <div className='col-12 text-login'>Vui lòng điền thông tin thành viên</div>
                    <form onSubmit={formik.handleSubmit} className='col-12'>
                        <div className='form-group login-input'>
                            <label>Tài khoản:</label>
                            <span>
                                <FontAwesomeIcon className="icon-user" icon={faUser} />
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter your username'
                                    name='userName'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userName}
                                />
                            </span>
                            {formik.touched.userName && formik.errors.userName && (
                                <div className='error-message'>{formik.errors.userName}</div>
                            )}
                        </div>
                        <div className='form-group login-input'>
                            <label>Mật khẩu:</label>
                            <div className='custom-input-password'>
                                <FontAwesomeIcon icon={faLock} />

                                <input
                                    type={formik.values.showPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    name='passWord'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.passWord}
                                />
                                <span onClick={() => formik.setFieldValue('showPassword', !formik.values.showPassword)}>
                                    {formik.values.showPassword ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i>}
                                </span>
                            </div>
                            {formik.touched.passWord && formik.errors.passWord && (
                                <div className='error-message'>{formik.errors.passWord}</div>
                            )}
                        </div>
                        <div className='error-message col-12'>
                            {formik.errors.general}
                        </div>
                        <div className='col-12'>
                            <button type='submit' className='btn-login' disabled={formik.isSubmitting}>
                                Đăng nhập
                            </button>
                            <button className='btn-login' onClick={toggleModal}>
                                Tạo tài khoản
                            </button>
                        </div>
                    </form>
                    <ModalRegisterMember
                        isOpen={isModalOpen}
                        toggleFromParent={toggleModal}
                        createNewUser={doCreateNewUser}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginMember;
