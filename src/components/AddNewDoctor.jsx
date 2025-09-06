import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AddNewDoctor.css";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    doctorDepartment: "",
  });

  const [docAvatar, setDocAvatar] = useState(null);
  const [docAvatarPreview, setDocAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physiotherapy",
    "Dermatology",
    "Opthalmology",
    "Gynecology",
    "Odontology",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const validateForm = () => {
    const {
      firstName,
      lastName,
      phone,
      password,
      confirmPassword,
      gender,
      doctorDepartment,
    } = formData;
    if (!/^[A-Za-z ]{3,}$/.test(firstName)) {
      toast.error("First Name must contain at least 3 letters");
      return false;
    }
    if (!/^[A-Za-z ]{3,}$/.test(lastName)) {
      toast.error("Last Name must contain at least 3 letters");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must contain exactly 10 digits");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!["Male", "Female"].includes(gender)) {
      toast.error("Please select a valid gender");
      return false;
    }
    if (!doctorDepartment) {
      toast.error("Please select a department");
      return false;
    }
    if (!docAvatar) {
      toast.error("Doctor avatar is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        dataToSend.append(key, value)
      );
      dataToSend.append("docAvatar", docAvatar);
      dataToSend.append("role", "Doctor");

      const { data } = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/doctor/addnew",
        dataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message, { onClose: () => navigateTo("/") });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        password: "",
        confirmPassword: "",
        doctorDepartment: "",
      });
      setDocAvatar(null);
      setDocAvatarPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="add-new-doctor-wrapper">
      <div className="add-new-doctor-box">
        <img src="/logo.png" alt="logo" className="add-new-doctor-logo" />
        <h1 className="doctor-form-title">ADD NEW DOCTOR</h1>
        <form onSubmit={handleSubmit} className="add-new-doctor-form">
          <div className="avatar-section">
            <img
              src={docAvatarPreview || "/docHolder.jpg"}
              alt="Doctor Avatar"
            />
            <input type="file" onChange={handleAvatar} />
          </div>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="password-row">
            <div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            name="doctorDepartment"
            value={formData.doctorDepartment}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departmentsArray.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button type="submit">Add New Doctor</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewDoctor;
