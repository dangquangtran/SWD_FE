import axios from "../axios";

const handleLoginAdmin = (userName, userPassword) => {
  return axios.post("api/login-admin", {
    username: userName,
    password: userPassword,
  });
};

const handleLogOut = () => {
  return axios.get("api/logout");
};

//members
const getAllMembers = (filter) => {
  return axios.get("/api/members?" + new URLSearchParams(filter).toString());
};

const createMember = (data) => {
  return axios.post("api/members", data);
};

const editMember = (memberId, data) => {
  return axios.put(`api/members/${memberId}`, data);
};

const deleteMember = (memberId) => {
  return axios.delete(`api/members/${memberId}`);
};

const getAllBuildingId = () => {
  return axios.get("api/buildings");
};

//sport
const getAllSports = () => {
  return axios.get("api/sports");
};

const createSport = (data) => {
  return axios.post("api/sports", data);
};

const editSport = (sportId, data) => {
  return axios.put(`api/sports/${sportId}`, data);
};

const deleteSport = (sportId) => {
  return axios.delete(`api/sports/${sportId}`);
};

//club
const getAllClub = () => {
  return axios.get("api/clubs");
};

const createClub = (data) => {
  return axios.post("api/clubs", data);
};

const getDetailClub = (clubId) => {
  return axios.get(`api/clubs/${clubId}`);
};

const editClub = (clubId, data) => {
  return axios.put(`api/clubs/${clubId}`, data);
};

const deleteClub = (clubId) => {
  return axios.delete(`api/clubs/${clubId}`);
};

const ClubMember = () => {
  return axios.get("api/clubMembers");
};

const checkMemberJoinClub = (memberId, clubId) => {
  return axios.get(`api/clubMembers/check_join/${memberId}/${clubId}`);
};

const MemberJoinClub = (data) => {
  return axios.post(`api/clubMembers/join_club`, data);
};

const MemberLeavingClub = (data) => {
  return axios.put(`api/clubMembers/leaving_club`, data);
};

const getPostInClub = (idClub) => {
  return axios.get(`api/slots/${idClub}}/id_club`);
};

const createPostInSlot = (data) => {
  return axios.post("api/slots", data);
};

//yard

const getAllYards = () => {
  return axios.get("api/yards");
};

const createYard = (data) => {
  return axios.post("api/yards", data);
};

const deleteYard = (YardId) => {
  return axios.delete(`api/yards/${YardId}`);
};

const editYard = (yardId, data) => {
  return axios.put(`api/yards/${yardId}`, data);
};

const getYardsBySport = (sportId) => {
  return axios.get(`api/yards/${sportId}/sport`);
};

const getIdMemberCreatePost = (idMember, idClub) => {
  return axios.get(`api/clubMembers/getByIdMemberClub/${idMember}/${idClub}`);
};

const getNumberOfSlot = (idSlot) => {
  return axios.get(`api/clubMemSlots/getNumberOfSlot/${idSlot}`);
};

const UserJointSlot = (data) => {
  return axios.post(`api/clubMemSlots`, data);
};

const getSlotJoined = (clubMember) => {
  return axios.get(`api/clubMemSlots/${clubMember}/getSlotJoined`);
};

const getSlotPostJoined = (idSlot) => {
  return axios.get(`api/slots/${idSlot}`);
};

const getTranPoint = () => {
  return axios.get(`api/tranpoints/new`);
};

const getMyPostInClub = (clubMember) => {
  return axios.get(`api/slots/${clubMember}/id_clubmember`);
};

const getWalletByMemberId = (memberId) => {
  return axios.get(`api/wallets/${memberId}/getByMember`);
};

const getSlotJoinedByPostJoined = (clubMem) => {
  return axios.get(`api/slots/${clubMem}/getSlotJoined`);
};

const getSlotNotJoined = (clubMem, idClub) => {
  return axios.get(`api/slots/${clubMem}/${idClub}/getSlotnotJoin`);
};
const getYardDetail = (yard) => {
  return axios.get(`api/yards/${yard}`);
};

const getYards = () => {
  return axios.get(`api/yards`);
};

//approval
const updateClubApproved = (clubid) => {
  return axios.put(`api/admin/club/approve/${clubid}`);
};

const updateClubReject = (clubid) => {
  return axios.put(`api/admin/club/reject/${clubid}`);
};

//building
const getAllBuildings = () => {
  return axios.get("api/buildings");
};

const createBuilding = (data) => {
  return axios.post("api/buildings", data);
};

const editBuilding = (buildingId, data) => {
  return axios.put(`api/buildings/${buildingId}`, data);
};

const deleteBuilding = (buildingId) => {
  return axios.delete(`api/buildings/${buildingId}`);
};

//area
const getAllAreas = () => {
  return axios.get("api/areas");
};

//Transpoint
const getTranspoint = () => {
  return axios.get("api/tranpoints/new");
};

const createTranPoint = (data) => {
  return axios.post("api/tranpoints", data);
};

const getSlotByIdClub = (idclub) => {
  return axios.get(`api/slots/${idclub}/id_club`);
};

const deleteSlotByIdSlot = (idslot) => {
  return axios.delete(`api/slots/${idslot}`)
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
  deleteClub,
  getDetailClub,
  ClubMember,
  checkMemberJoinClub,
  MemberJoinClub,
  MemberLeavingClub,
  getPostInClub,
  createPostInSlot,
  getAllYards,
  getIdMemberCreatePost,
  getNumberOfSlot,
  UserJointSlot,
  getTranPoint,
  getSlotJoined,
  getMyPostInClub,
  getWalletByMemberId,
  getSlotJoinedByPostJoined,
  getSlotPostJoined,
  getYardDetail,
  getSlotNotJoined,
  getYards,
  updateClubApproved,
  updateClubReject,
  getYardsBySport,
  getAllBuildings,
  getAllAreas,
  createYard,
  deleteYard,
  editYard,
  editBuilding,
  createBuilding,
  deleteBuilding,
  getTranspoint,
  createTranPoint,
  getSlotByIdClub,
  deleteSlotByIdSlot
};
