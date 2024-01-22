import AdminPage from "../page/AdminPage/AdminPage";
import HomePage from "../page/HomePage/HomePage";
import LoginPage from "../page/LoginPage/LoginPage"; 

export const routes = [
    {
        path: '/',
        page: HomePage
    },
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/admin',
        page: AdminPage
    }
]