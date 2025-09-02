import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AddNewAdmin from './components/AddNewAdmin';
import AddNewDoctor from './components/AddNewDoctor';
import Messages from './components/Messages';
import Doctors from './components/Doctors';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from './main';
import axios from 'axios';

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    if (window.location.pathname === "/login") return;

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
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/doctor/addnew' element={<AddNewDoctor />} />
        <Route path='/admin/addnew' element={<AddNewAdmin />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/doctors' element={<Doctors />} />
      </Routes>

    </Router>
  );
};

export default App;
