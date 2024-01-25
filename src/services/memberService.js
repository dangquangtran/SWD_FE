import axios from "../axios"

const handleLoginMember = (userName, userPassword) => {
    return axios.post('api/login-member', { email: userName, password : userPassword });
}

export {
    handleLoginMember
}