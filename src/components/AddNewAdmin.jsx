import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    e.preventDefault();

    // Frontend Validations
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(firstName.trim()) || firstName.trim().length < 3) {
      toast.error("First Name must be at least 3 characters and only letters.");
      return;
    }

    if (!nameRegex.test(lastName.trim()) || lastName.trim().length < 3) {
      toast.error("Last Name must be at least 3 characters and only letters.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!phoneRegex.test(phone.trim())) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!dob) {
      toast.error("Please select Date of Birth.");
      return;
    }

    if (!gender) {
      toast.error("Please select Gender.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/admin/addnew",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          dob,
          gender,
          password,
          confirmPassword,
          role: "Admin", // explicitly send role
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);
      navigateTo("/"); // redirect after success

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error.response?.data); // see full backend error
      toast.error(error.response?.data?.message || "Something went wrong");
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
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="add-new-admin-row">
            <input
              type="date"
              placeholder="Date of Birth"
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
