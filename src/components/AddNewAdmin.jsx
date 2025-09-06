import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./AddNewAdmin.css";

const AddNewAdmin = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAddNewAdmin = async (e) => {
    e.preventDefault(); // prevent default form reload

    // Regex validations
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;
    const passwordRegex = /^.{8,}$/;

    if (!nameRegex.test(firstName)) {
      toast.error("First name should contain only letters!", {
        position: "top-center",
      });
      return;
    }

    if (!nameRegex.test(lastName)) {
      toast.error("Last name should contain only letters!", {
        position: "top-center",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!", {
        position: "top-center",
      });
      return;
    }

    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 7–15 digits!", {
        position: "top-center",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters", {
        position: "top-center",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/admin/addnew",
        {
          firstName,
          lastName,
          email,
          phone,
          dob,
          gender,
          password,
          confirmPassword,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message, { position: "top-center", autoClose: 2000 });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigateTo("/");
      }, 2100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        autoClose: 5000,
      });
      // Stay on AddNewAdmin page
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="add-new-admin-wrapper">
      {/* Local Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="add-new-admin-box">
        <img src="/logo.png" alt="logo" className="add-new-admin-logo" />
        <h1 className="admin-form-title">ADD NEW ADMIN</h1>

        <form onSubmit={handleAddNewAdmin} className="add-new-admin-form">
          <div className="add-new-admin-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="add-new-admin-row">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="add-new-admin-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="add-new-admin-row">
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="add-new-admin-password-row">
            <div className="add-new-admin-password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="add-new-admin-password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="add-new-admin-row">
            <input
              type="text"
              placeholder="Date of Birth"
              onFocus={(e) => (e.target.type = "date")}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="add-new-admin-submit">
            <button type="submit">Add New Admin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
