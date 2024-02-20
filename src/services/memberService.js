import axios from "../axios"

const handleLoginMember = (userName, userPassword) => {
    return axios.post('api/login-member', { email: userName, password : userPassword });
}

const handleLogoutMember = () => {
    return axios.get('api/logout');
}

const registerMember = (data) => {
    return axios.post('api/register', data);
}

export {
    handleLoginMember,
    handleLogoutMember,
    registerMember
}