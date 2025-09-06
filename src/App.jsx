import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, loading, setLoading } =
    useContext(Context);

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setIsAuthenticated, setUser, setLoading]);

  // While auth check is in progress, prevent rendering components
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {/* ToastContainer should always be rendered first */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      {isAuthenticated && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor/addnew"
          element={
            isAuthenticated ? <AddNewDoctor /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/addnew"
          element={isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={isAuthenticated ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/doctors"
          element={isAuthenticated ? <Doctors /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
