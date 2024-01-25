import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from './routes';

function App() {
    return (
        <div className="App">
            <ToastContainer position="top-right" autoClose={2000} />
            <Router>
                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.page;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    route.requiresAuth ? (
                                        // Kiểm tra xác thực trước khi render trang admin
                                        localStorage.getItem('token') ? (
                                            <Page />
                                        ) : (
                                            <Navigate to="/" />
                                        )
                                    ) : (
                                        <Page />
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
