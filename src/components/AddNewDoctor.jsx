import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./AddNewDoctor.css";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

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

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();

    // Validations
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format", { position: "top-center" });
    }
    if (!phoneRegex.test(phone)) {
      return toast.error("Phone must be 10 digits", { position: "top-center" });
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be at least 8 characters",
        { position: "top-center" }
      );
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("role", "Doctor");
      formData.append("docAvatar", docAvatar);

      const { data } = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message, { autoClose: 2000, position: "top-center" });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setDoctorDepartment("");
      setDocAvatar("");
      setDocAvatarPreview("");

      navigateTo("/"); // Redirect after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="add-new-doctor-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="add-new-doctor-box">
        <img src="/logo.png" alt="logo" className="add-new-doctor-logo" />
        <h1 className="doctor-form-title">ADD NEW DOCTOR</h1>
        <form onSubmit={handleAddNewDoctor} className="add-new-doctor-form">
          <div className="first-wrapper">
            <div className="avatar-section">
              <img
                src={docAvatarPreview || "/docHolder.jpg"}
                alt="Doctor Avatar"
              />
              <input type="file" onChange={handleAvatar} />
            </div>
            <div className="form-section">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                onFocus={(e) => (e.target.type = "date")}
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
              <select
                value={doctorDepartment}
                onChange={(e) => setDoctorDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </select>

              {/* Password input with toggle */}
              <div className="password-toggle-wrapper">
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

              <button type="submit">Add New Doctor</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDoctor;
