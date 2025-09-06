import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AddNewAdmin.css";

const AddNewAdmin = () => {
  const { isAuthenticated, loading } = useContext(Context);
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

  // Show loading state while verifying auth
  if (loading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();

    // Validation
    if (!/^[A-Za-z ]{3,}$/.test(firstName))
      return toast.error("First Name must contain at least 3 letters", {
        autoClose: 5000,
        position: "top-center",
      });
    if (!/^[A-Za-z ]{3,}$/.test(lastName))
      return toast.error("Last Name must contain at least 3 letters", {
        autoClose: 5000,
        position: "top-center",
      });
    if (!/^\d{10}$/.test(phone))
      return toast.error("Phone number must contain exactly 10 digits", {
        autoClose: 5000,
        position: "top-center",
      });
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters", {
        autoClose: 5000,
        position: "top-center",
      });
    if (password !== confirmPassword)
      return toast.error("Passwords do not match", {
        autoClose: 5000,
        position: "top-center",
      });
    if (!["Male", "Female"].includes(gender))
      return toast.error("Please select a valid gender", {
        autoClose: 5000,
        position: "top-center",
      });

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
          role: "Admin",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message, {
        autoClose: 2000,
        position: "top-center",
        pauseOnHover: false,
        onClose: () => navigateTo("/"),
      });

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
      toast.error(error.response?.data?.message || "Something went wrong", {
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

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
