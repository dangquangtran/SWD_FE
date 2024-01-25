import AdminPage from "../page/AdminPage/AdminPage";
import HomePage from "../page/HomePage/HomePage";
import LoginPage from "../page/LoginPage/LoginPage"; 
import MemberPage from "../page/MemberPage/MemberPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        requiresMember: true,
    },
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/admin',
        page: AdminPage,
        requiresAuth: true
    },
    {
        path: '/members',
        page: MemberPage
    }
]