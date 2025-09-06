import React, { useContext, useState, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
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
    await axios
      .get("https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/admin/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const gotoPage = (path) => {
    navigateTo(path);
    setShow(false); // close sidebar after navigation
  };

  return (
    <>
    <ToastContainer position="top-center" autoClose={3000} />
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="sidebar-links">
          <TiHome onClick={() => gotoPage("/")} />
          <FaUserDoctor onClick={() => gotoPage("/doctors")} />
          <MdAddModerator onClick={() => gotoPage("/admin/addnew")} />
          <IoPersonAddSharp onClick={() => gotoPage("/doctor/addnew")} />
          <AiFillMessage onClick={() => gotoPage("/messages")} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="sidebar-wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu
          className="sidebar-hamburger"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
