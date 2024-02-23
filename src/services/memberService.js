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

//wallet

const getUserWallet = (memberId) => {
    return axios.get(`api/wallets/${memberId}/getByMember`);
}

export {
    handleLoginMember,
    handleLogoutMember,
    registerMember,
    getUserWallet
}