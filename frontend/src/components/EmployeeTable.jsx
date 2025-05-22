import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/EmployeeTable.css"


const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New success state
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/employees", {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      setEmployees(response.data);
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized: Your session may have expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        setError("Failed to fetch employees.");
      }
      console.error("Error fetching employees:", err);
    }
  };

  const handleDelete = async (employeeId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await axios.delete(`http://127.0.0.1:5000/admin/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set success message
      setSuccessMessage("Deleted Successfully");
      setError("");

      // Refresh employee list
      fetchEmployees();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete employee.");
      console.error("Error deleting employee:", err);
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
      <div className="col-md-11">

     <div className="bg-dark p-5" style={{borderRadius: "1rem"}}>
      
      <h3 className="text-white">Employee List</h3>

      {/* Display success or error messages */}
      {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="table table-dark table-striped">
        <thead  className="border">
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Address</th>
            <th>Working Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="border">
          {employees.length > 0 ? (
            employees.map((emp, index) => (
              <tr key={index}>
                <td>{emp.email}</td>
                <td>{emp.firstname} {emp.lastname}</td>
                <td>{emp.employee_id}</td>
                <td>{emp.address}</td>
                <td>{emp.working_status}</td>
                <td>
                  <button onClick={() => navigate(`/admin/employee/${emp.employee_id}`)} className="btn btn-primary mx-1">
                    View
                  </button>
                  <button onClick={() => handleDelete(emp.employee_id)} className="btn btn-danger mx-1">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
