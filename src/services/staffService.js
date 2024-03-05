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

const getAllClubStaff = (staffId) => {
    return axios.get(`api/staff/get-club/${staffId}`);
}

const createClubStaff = (data) => {
    return axios.post("api/clubs", data);
};

export {
    handleLoginStaff,
    handleLogoutStaff,
    getAllClubStaff,
    createClubStaff
}