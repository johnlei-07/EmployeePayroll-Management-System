import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/AdminDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
      setEmployeeCount(response.data.length); // Count employees from fetched list
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  const getDepartmentData = () => {
    const departmentMap = {};
  
    employees.forEach((emp) => {
      const dept = emp.department || "Unknown";
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    });
  
    return Object.entries(departmentMap).map(([name, value]) => ({
      name,
      value,
    }));
  };
  
  const departmentData = getDepartmentData();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF4444"];

  return (
     <div className="admin-dashboard">
    <div className="sidebar">
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
      <div className="dashboard-row mt-4">
        {/* Employee Count Card */}
        <div className="d-flex gap-2">
          <div className="employee-count-card p-4 rounded text-center mb-4 bg-dark text-white" style={{ width: "30%" }}>
            <h3>Total Employees</h3>
            <h1>{employeeCount}</h1>
          </div>
          <div className="employee-count-card p-4 rounded text-center mb-4 bg-dark text-white" style={{ width: "30%" }}>
              <h3>Total Male</h3>
              <h1>{employeeCount}</h1>
          </div>
        </div>
        

        {/* Charts Row */}
        <div className="charts-row d-flex flex-wrap justify-content-between gap-4">
        {/* Bar Chart */}
        <div className="bar-chart-container bg-dark text-white p-4 rounded" style={{ flex: "1", minWidth: "300px" }}>
          <h3 className="text-center mb-4">Top Paid Employees (by Net Salary)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[...employees]
                .filter(emp => emp.net_salary !== null)
                .sort((a, b) => b.net_salary - a.net_salary)
                .slice(0, 5)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(employee) => `${employee.firstname} ${employee.lastname}`} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="net_salary" fill="#00c49f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="department-pie-chart bg-dark text-white p-4 rounded" style={{ flex: "1", minWidth: "300px" }}>
          <h3 className="text-center mb-4">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
