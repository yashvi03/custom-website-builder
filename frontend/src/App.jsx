import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Forms/Login";
import RolePage from "./pages/RolePage";
import Create from "./Forms/Create";
import AddRole from "./Forms/AddRole";
import { useState, useEffect } from "react";
import Register from "./Forms/Register";
import AlertBox from "./components/AlertBox";
import { AlertProvider, useAlert } from "./context/AlertContext";
import UserPage from "./pages/UserPage";
import Profile from "./pages/Profile";
import CareerGrid from "./pages/CareerGrid";
import Job from "./Forms/Job";
import CareerPage from "./pages/CareerPage";
import Employee from "./pages/Employee";
import Home from "./Layout/Home";
import HomeForm from "./Forms/Home";
import PageNotFound from "./pages/PageNotFound";
function App() {
  const [trigger, setTrigger] = useState(0);
  const refresh_token = localStorage.getItem("refresh_token");
  const perm = JSON.parse(localStorage.getItem("perm")) || '';
  const is_super = JSON.parse(localStorage.getItem("is_super"));
  // console.log(is_super)

  const AlertWrapper = () => {
    const { alert } = useAlert();
    return alert ? <AlertBox message={alert.message} /> : null;
  };
  const stepper = 10000;

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleMouseMove);
    };
  });

  const handleMouseMove = () => {
    setTrigger(trigger + 1);
  };

  useEffect(() => {
    if (trigger > stepper) {
      if (refresh_token) {
        async function fetchData() {
          const response = await fetch("http://127.0.0.1:8000/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refresh_token}`,
            },
            body: JSON.stringify({
              refresh_token: refresh_token,
            }),
          });
          if (response.ok) {
            let data = await response.json();
            localStorage.access_token = data.token.access_token;
            localStorage.refresh_token = data.token.refresh_token;
            setTrigger(0);
          }
        }
        fetchData();
      }
    }
    return () => {};
  }, [trigger]);

  return (
    <div>
      <AlertProvider>
        <Router>
          <AlertWrapper />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {((perm[0]?.page === "Employee" && perm[0]?.permission.add) ||
              is_super) && <Route path="/create" element={<Create />} />}
            {((perm[0]?.page === "Employee" && perm[0]?.permission.view) ||
              is_super) && <Route path="/employee" element={<Employee />} />}
            {((perm[1]?.page === "Role" && perm[1]?.permission.view) ||
              is_super) && <Route path="/role" element={<RolePage />} />}
            {((perm[1]?.page === "Role" && perm[1]?.permission.add) ||
              is_super) && <Route path="/addRole" element={<AddRole />} />}
            {is_super && <Route path="/users" element={<UserPage />} />}

            <Route path="/profile" element={<Profile />} />
            <Route path="/career" element={<CareerGrid />} />
            <Route path="/job" element={<Job />} />
            <Route path="/career-page" element={<CareerPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home-form" element={<HomeForm />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AlertProvider>
    </div>
  );
}

export default App;
