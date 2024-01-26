import axios from "../axios"

const handleLoginMember = (userName, userPassword) => {
    return axios.post('api/login-member', { email: userName, password : userPassword });
}

const handleLogoutMember = () => {
    return axios.get('api/logout')
}

export {
    handleLoginMember,
    handleLogoutMember
}