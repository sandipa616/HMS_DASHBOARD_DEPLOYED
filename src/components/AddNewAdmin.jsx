import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AddNewAdmin.css";

const AddNewAdmin = () => {
  const { isAuthenticated } = useContext(Context);

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

  const navigateTo = useNavigate();

  // Helper to show toast and scroll to top
  const showToast = (message, type = "error") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    type === "success" ? toast.success(message) : toast.error(message);
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();

    // Frontend regex validation to match backend
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^.{8,}$/;

    if (!nameRegex.test(firstName))
      return showToast(
        "First Name must contain only letters and at least 3 characters"
      );

    if (!nameRegex.test(lastName))
      return showToast(
        "Last Name must contain only letters and at least 3 characters"
      );

    if (!phoneRegex.test(phone))
      return showToast("Phone number must contain exactly 10 digits!");

    if (!passwordRegex.test(password))
      return showToast("Password must be at least 8 characters!");

    if (password !== confirmPassword) return showToast("Passwords do not match!");

    if (!["Male", "Female"].includes(gender))
      return showToast("Please select a valid gender!");

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
          role: "Admin", // required by backend
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      showToast(data.message, "success");
      navigateTo("/");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.response?.data);
      showToast(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="add-new-admin-wrapper">
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
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
