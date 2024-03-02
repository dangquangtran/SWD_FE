import axios from "../axios";

const handleLoginStaff = (userName, userPassword) => {
    return axios.post("api/login-staff", {
        username: userName,
        password: userPassword,
    });
};


const handleLogoutStaff = () => {
    return axios.get('api/logout');
}
export {
    handleLoginStaff
}