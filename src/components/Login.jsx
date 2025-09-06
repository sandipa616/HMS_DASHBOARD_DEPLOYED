import React, { useContext, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/login",
        { email, password, role: "Admin" },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      // Show success toast
      toast.success(res.data.message, { autoClose: 2000, pauseOnHover: true });

      setIsAuthenticated(true);
      setEmail("");
      setPassword("");

      // Delay navigation so toast is visible
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || "Something went wrong!", {
        autoClose: 3000,
        pauseOnHover: true,
      });
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="container form-component" style={{ overflow: "visible" }}>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="form-title">WELCOME TO MEDORA</h1>
      <p>Only Admins Are Allowed To Access These Resources!</p>

      <form onSubmit={handleLogin}>
        <div className="login-email-wrapper">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="login-toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>

      {/* Local ToastContainer */}
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Login;
