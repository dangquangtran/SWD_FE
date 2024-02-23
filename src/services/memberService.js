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

const getTransactionHistoryPoints = (walletId) => {
    return axios.get(`api/transactionHistoryPoints/${walletId}/wallet`)
}

export {
    handleLoginMember,
    handleLogoutMember,
    registerMember,
    getUserWallet,
    getTransactionHistoryPoints
}