import axios from "../axios"

const handleLoginAdmin = (userName, userPassword) => {
    return axios.post('api/login-admin', { username: userName, password : userPassword });
}

const handleLogOut = () => {
    return axios.get('api/logout');
}

//members
const getAllMembers = () => {
    return axios.get('/api/members');
}

const createMember = (data) => {
    return axios.post('api/members', data);
}

const editMember = (memberId, data) => {
    return axios.put(`api/members/${memberId}`, data);
}

const deleteMember = (memberId) => {
    return axios.delete(`api/members/${memberId}`);
}

const getAllBuildingId = () => {
    return axios.get('api/buildings');
}

//sport
const getAllSports = () => {
    return axios.get('api/sports');
}

const createSport = (data) => {
    return axios.post('api/sports', data);
}

const editSport = (sportId, data) => {
    return axios.put(`api/sports/${sportId}`, data);
}

const deleteSport = (sportId) => {
    return axios.delete(`api/sports/${sportId}`);
}

//club
const getAllClub = () => {
    return axios.get('api/clubs');
}

const createClub = (data) => {
    return axios.post('api/clubs', data);
}

const editClub = (clubId, data) => {
    return axios.put(`api/clubs/${clubId}`, data);
}

const deleteClub = (clubId) => {
    return axios.delete(`api/clubs/${clubId}`);
}

export { 
    handleLoginAdmin,
    getAllMembers, 
    handleLogOut,
    createMember,
    editMember,
    deleteMember,
    getAllBuildingId,
    getAllSports,
    createSport,
    editSport,
    deleteSport,
    getAllClub,
    createClub,
    editClub,
    deleteClub
}