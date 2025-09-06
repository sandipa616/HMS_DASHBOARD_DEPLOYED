import React, { useContext, useState, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import './Sidebar.css';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (show) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [show]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/admin/logout",
        { withCredentials: true }
      );

      // Show toast immediately
      toast.success(res.data.message, { autoClose: 2000 });

      // Delay logout so toast can display
      setTimeout(() => {
        setIsAuthenticated(false);
        navigateTo("/login");
      }, 2100); // slightly longer than toast duration

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        autoClose: 3000,
      });
    }
  };

  const gotoPage = (path) => {
    navigateTo(path);
    setShow(false);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Local ToastContainer in Sidebar */}
      <ToastContainer position="top-center" autoClose={2000} />

      <nav className={show ? "show sidebar" : "sidebar"}>
        <div className="sidebar-links">
          <TiHome onClick={() => gotoPage("/")} />
          <FaUserDoctor onClick={() => gotoPage("/doctors")} />
          <MdAddModerator onClick={() => gotoPage("/admin/addnew")} />
          <IoPersonAddSharp onClick={() => gotoPage("/doctor/addnew")} />
          <AiFillMessage onClick={() => gotoPage("/messages")} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>

      <div className="sidebar-wrapper">
        <GiHamburgerMenu
          className="sidebar-hamburger"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
