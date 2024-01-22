import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from './routes';

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          {routes.map((route, index) => {
            const Page = route.page;
            return (
              <Route key={index} path={route.path} element={<Page />} />
            )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
