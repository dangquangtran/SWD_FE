import axios from "../axios";

const handleLoginStaff = (userName, userPassword) => {
    return axios.post("api/login-staff", {
        email: userName,
        password: userPassword,
    });
};


const handleLogoutStaff = () => {
    return axios.get('api/logout');
}

const getAllClubStaff = (staffId) => {
    return axios.get(`api/staff/get-club/${staffId}`);
}

const createClubStaff = (staffId, data) => {
    return axios.post(`api/clubs/${staffId}`, data);
};

const getAllStaffs = () => {
    return axios.get("api/admin/staffs");
}

const createStaff = (data) => {
    return axios.post("api/admin/staffs", data);
}

const editStaff = (staffId, data) => {
    return axios.put(`api/admin/staffs/${staffId}`, data);
}

const deleteStaff = (staffId) => {
    return axios.delete(`api/admin/staffs/${staffId}`);
}

const getMemberInClub = (clubId) => {
    return axios.get(`api/staff/get-member-club/${clubId}`);
}

const memberById = (memberId) => {
    return axios.get(`api/members/${memberId}`);
}

export {
    handleLoginStaff,
    handleLogoutStaff,
    getAllClubStaff,
    createClubStaff,
    getAllStaffs,
    createStaff,
    editStaff,
    deleteStaff,
    getMemberInClub,
    memberById
}