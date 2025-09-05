import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AddNewDoctor.css";

const AddNewDoctor = () => {
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
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

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

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();

    // Frontend regex validation
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^.{8,}$/;

    if (!nameRegex.test(firstName)) {
      return toast.error(
        "First Name must contain only letters and at least 3 characters"
      );
    }

    if (!nameRegex.test(lastName)) {
      return toast.error(
        "Last Name must contain only letters and at least 3 characters"
      );
    }

    if (!phoneRegex.test(phone)) {
      return toast.error("Phone number must contain exactly 10 digits!");
    }

    if (!passwordRegex.test(password)) {
      return toast.error("Password must be at least 8 characters!");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (!["Male", "Female"].includes(gender)) {
      return toast.error("Please select a valid gender!");
    }

    if (!doctorDepartment) {
      return toast.error("Please select a department!");
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
      formData.append("role", "Doctor"); // required by backend
      formData.append("docAvatar", docAvatar);

      const response = await axios.post(
        "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message);
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
      setDoctorDepartment("");
      setDocAvatar("");
      setDocAvatarPreview("");
    } catch (error) {
      console.log(error.response?.data); // for debugging
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="add-new-doctor-wrapper">
      <div className="add-new-doctor-box">
        <img src="/logo.png" alt="logo" className="add-new-doctor-logo" />
        <h1 className="doctor-form-title">ADD NEW DOCTOR</h1>

        <form onSubmit={handleAddNewDoctor} className="add-new-doctor-form">
          <div className="first-wrapper">
            <div className="avatar-section">
              <img
                src={docAvatarPreview ? docAvatarPreview : "/docHolder.jpg"}
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

              <div className="add-new-doctor-password-row">
                <div className="add-new-doctor-password-input">
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

                <div className="add-new-doctor-password-input">
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
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                ))}
              </select>

              <button type="submit">Add New Doctor</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDoctor;
