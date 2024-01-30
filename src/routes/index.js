import AdminPage from "../page/AdminPage/AdminPage";
import ClubPage from "../page/ClubPage/ClubPage";
import HomePage from "../page/HomePage/HomePage";
import LoginMember from "../page/LoginPage/LoginMember";
import LoginPage from "../page/LoginPage/LoginPage"; 
import MemberPage from "../page/MemberPage/MemberPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
    },
    {
        path: '/login-admin',
        page: LoginPage
    },
    {
        path: '/login-member',
        page: LoginMember
    },
    {
        path: '/admin',
        page: AdminPage,
        requiresAuth: true
    },
    {
        path: '/members',
        page: MemberPage,
        requiresAuth: true
    },
    {
        path: '/member-sport/:id',
        page: ClubPage,
        requiresAuth: true
    }
]