import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle, AiOutlineClockCircle } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://hms-backend-deployed-f9l0.onrender.com/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        console.error(error);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "https://hms-backend-deployed-f9l0.onrender.com/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        console.error(error);
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  // Update appointment status
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://hms-backend-deployed-f9l0.onrender.com/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast.success(data.message || "Status updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Status Icon
  const getStatusIcon = (status) => {
    if (status === "Pending") return <AiOutlineClockCircle className="status-icon pending" />;
    if (status === "Accepted") return <GoCheckCircleFill className="status-icon accepted" />;
    if (status === "Rejected") return <AiFillCloseCircle className="status-icon rejected" />;
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Banner / Summary */}
      <div className="banner summary">
        <div className="firstBox">
          <img src="/doctor.jpg" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello ,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Welcome to your dashboard. Here you can manage appointments,
              track patients, and oversee registered doctors with ease.
            </p>
          </div>
        </div>

        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments.length}</h3>
        </div>

        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{doctors.length}</h3>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="banner appointments">
        <h5>Appointments</h5>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td className="status-cell">
                      {getStatusIcon(appointment.status)}
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Appointments Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
