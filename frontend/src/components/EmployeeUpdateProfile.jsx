import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // Install via `npm install dayjs`

const EmployeeUpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    working_status: "",
    department: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://127.0.0.1:5000/admin/employee-profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(response.data);
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => {
      const updatedEmployee = { ...prev, [name]: value };

      // Auto-update payslip_month_year based on the selected start & end dates
      if (name === "payslip_start" || name === "payslip_end") {
        updatedEmployee.payslip_month_year = formatPayslipDate(
          updatedEmployee.payslip_start,
          updatedEmployee.payslip_end
        );
      }

      return updatedEmployee;
    });
  };

  // Function to format payslip_month_year like Laravel Blade logic
  const formatPayslipDate = (start, end) => {
    if (!start || !end) return "";

    const startDate = dayjs(start);
    const endDate = dayjs(end);

    if (startDate.year() === endDate.year()) {
      return `${startDate.format("MMM D")} - ${endDate.format("D, YYYY")}`;
    } else {
      return `${startDate.format("MMM D, YYYY")} - ${endDate.format("MMM D, YYYY")}`;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      await axios.put(`http://127.0.0.1:5000/admin/employee/${id}`, employee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Employee Profile updated successfully!");
      setErrorMessage(""); // Clear error message if successful
      setTimeout(() => {
        navigate(`/admin/employee/${id}`);
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Error updating employee:", err);
      setSuccessMessage(""); // Clear success message if there's an error
      setErrorMessage(err.response?.data?.message || "Failed to update employee. Please try again.");
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <header className="d-flex justify-content-between align-items-center bg-dark text-white ">
        <button onClick={() => navigate(`/admin/employee/${employee.employee_id}`)}className="btn btn-outline-light mx-3 px-3">Back</button>
        <h3 className="mx-auto m-3">Update Employee Profile</h3>
      </header>
      <div className="d-flex justify-content-center align-items-center mt-4 ">
        <div className="bg-dark text-white p-5 w-50">
          {/* Display success message */}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Display error message */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleUpdate} className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" name="firstname" value={employee.firstname || ""} onChange={handleChange} placeholder="First Name" required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" name="lastname" value={employee.lastname || ""} onChange={handleChange} placeholder="Last Name" required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" name="employee_id" value={employee.employee_id || "" } onChange={handleChange} placeholder="Employee Id" disabled />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" name="email" value={employee.email || ""} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" name="address" value={employee.address || ""} onChange={handleChange} placeholder="Address" required />
            </div>
            <div className="col-md-6">
              <select 
              name="working_status" 
              className="form-select"
              value={employee.working_status || ""}
              onChange={handleChange}
              required
              >
              <option value="">Select Working Status</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              </select>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" name="department" value={employee.department || ""} onChange={handleChange} placeholder="Department" required /> 
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-light mt-3">Update Employee</button>
            </div>
        </form>
        </div>
      </div>
    </section>
  );
};

export default EmployeeUpdateProfile;
