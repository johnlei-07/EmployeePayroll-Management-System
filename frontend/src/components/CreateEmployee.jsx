import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEmployee = ({ refreshEmployees }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    firstname: "",
    lastname: "",
    employee_id: "",
    address: "",
    working_status: "",
    department: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Check password match
    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Error: Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/admin/create/employee-account",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");

      if (refreshEmployees) {
        refreshEmployees();
      }

      // Clear form fields
      setFormData({
        email: "",
        password: "",
        confirm_password: "",
        firstname: "",
        lastname: "",
        employee_id: "",
        address: "",
        working_status: "",
        department:"",
      });
    } catch (err) {
      if (err.response) {
        console.warn("Response error:", err.response.data.message);
        setErrorMessage("Error: " + err.response.data.message);
      } else {
        console.warn("Network error:", err);
        setErrorMessage("Error: Unable to connect to the server.");
      }
    }
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };


  return (
    <div className="admin-dashboard">
      <div className="sidebar col-md-3">
        <h2 className="text-white text-center">Admin Panel</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="nav-link btn btn-outline-light" onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-outline-light" onClick={() => navigate("/admin/create-employee")}>
              Create Employee
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-outline-light" onClick={() => navigate("/admin/employee-list")}>
              Employee Table
            </button>
          </li>
          <div className="logout-container mt-auto mt-5">
          <button className="nav-link btn btn-outline-danger mt-5" onClick={handleLogout}>
            Logout
          </button>
          </div>
        </ul>
      </div>
      <div className="content">
         {/* Form Container */}
        
         <div className="col-md-9">
          <div className="form-container bg-dark p-5" style={{ borderRadius: "1rem" }}>
              <h3 className="text-white">Create Employee</h3>
                 {/* Display success or error messages */}
                {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

                
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input 
                type="text" 
                name="lastname"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
                />
              </div>


              <div className="col-md-4">
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">  
              <select
                name="working_status"
                className="form-select"
                value={formData.working_status}
                onChange={handleChange}
                required
              >
                <option value="">Select Working Status</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
              </div>

              <div className="col-md-6">
                <input 
                type="text" 
                name="department"
                className="form-control"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button type="submit" className="btn btn-outline-light mt-3" style={{ width: "10rem" }}>
                  Create Employee
                </button>
              </div>
            </form>
          </div>
         </div>
      </div>

      
    </div>
  );
};

export default CreateEmployee;
