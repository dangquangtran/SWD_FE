import AdminPage from "../page/AdminPage/AdminPage";
import StaffPage from "../page/StaffPage/StaffPage";

import ClubPage from "../page/ClubPage/ClubPage";
import HomePage from "../page/HomePage/HomePage";
import LoginMember from "../page/LoginPage/LoginMember";
import LoginPage from "../page/LoginPage/LoginPage";
import MemberPage from "../page/MemberPage/MemberPage";
import MainClubPage from "../page/MainClubPage/MainClubPage";
import LoginStaff from "../page/LoginPage/LoginStaff";
import ClubPageStaff from "../page/StaffPage/ClubPageStaff/ClubPageStaff";
import NewFeedStaff from "../page/StaffPage/NewFeedStaff/NewFeedStaff";

export const routes = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/login-admin",
    page: LoginPage,
  },
  {
    path: "/login-staff",
    page: LoginStaff,
  },
  {
    path: "/login-member",
    page: LoginMember,
  },
  {
    path: "/admin",
    page: AdminPage,
    requiresAuth: true,
  },
  {
    path: "/staff",
    page: StaffPage,
    requiresAuth: true,
  },
  {
    path: "/members",
    page: MemberPage,
    requiresAuth: true,
  },
  {
    path: "/member-sport/:id",
    page: ClubPage,
    requiresAuth: true,
  },
  {
    path: "/main-club/:id/:idclubmem",
    page: MainClubPage,
  },
  {
    path: "member-sport/staff/:clubId",
    page: ClubPageStaff
  },
  {
    path: "newfeed-staff/:clubId",
    page: NewFeedStaff
  }
];
