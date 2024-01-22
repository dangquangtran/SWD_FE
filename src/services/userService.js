import axios from "../axios"

const handleLoginAdmin = (userName, userPassword) => {
    return axios.post('api/login-admin', { username: userName, password : userPassword });
}

const getAllMembers = () => {
    return axios.get('/api/members');
}

export { 
    handleLoginAdmin,
    getAllMembers, 
}