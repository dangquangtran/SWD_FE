import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleLoginStaff } from "../../services/staffService";
import './LoginPage.scss';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {

    const formik = useFormik({
        initialValues: {
            email: '',
            passWord: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Yêu cầu email'),
            passWord: Yup.string().required('Yêu cầu mật khẩu '),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                let data = await handleLoginStaff(values.email, values.passWord);
                console.log(data);
                if (data && !_.isEmpty(data.token)) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userInfo', JSON.stringify(data.user));
                    window.location.href = '/staff';

                }
            } catch (error) {
                console.error(error);
                setErrors({ general: 'An error occurred during login.' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className='login-background'>
            <div className='login-container'>
                <div className='login-content row'>
                    <div className='col-12 text-login'>Vui lòng điền thông tin Staff</div>
                    <form onSubmit={formik.handleSubmit} className='col-12'>
                        <div className='form-group login-input'>
                            <label>Tài khoản:</label>
                            <span>
                                <FontAwesomeIcon className="icon-user" icon={faUser} />
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    name='email'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </span>
                            {formik.touched.email && formik.errors.email && (
                                <div className='error-message'>{formik.errors.email}</div>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
