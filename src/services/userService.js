import axios from "../axios"

const handleLoginAdmin = (userName, userPassword) => {
    return axios.post('api/login-admin', { username: userName, password : userPassword });
}

const handleLogOut = () => {
    return axios.get('api/logout');
}

const getAllMembers = () => {
    return axios.get('/api/members');
}

const createMember = (data) => {
    return axios.post('api/members', data)
}

const editMember = (memberId, data) => {
    return axios.put(`api/members/${memberId}`, data)
}

const deleteMember = (memberId) => {
    return axios.delete(`api/members/${memberId}`);
}

const getAllBuildingId = () => {
    return axios.get('api/buildings')
}

export { 
    handleLoginAdmin,
    getAllMembers, 
    handleLogOut,
    createMember,
    editMember,
    deleteMember,
    getAllBuildingId
}