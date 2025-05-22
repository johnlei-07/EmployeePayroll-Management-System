import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // Install via `npm install dayjs`

const EmployeeUpdatePayslip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    basic_salary: 0,
    num_days: 0,
    over_time: 0,
    bonus: 0,
    tax_deduction: 0,
    insurance_deduction: 0,
    net_salary: 0,
    total: 0,
    payslip_start: "",
    payslip_end: "",
    payslip_month_year: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://127.0.0.1:5000/admin/employee-payslip/${id}`, {
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
      setSuccessMessage("Employee Payslip updated successfully!");
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
    <section className="vh-100 gradient-custom ">
      <header className="d-flex justify-content-between align-items-center bg-dark text-white">
        <button onClick={() => navigate(-1)} className="btn btn-outline-light mx-3 px-3">Back</button>
        <h3 className="mx-auto m-3">Update Employee Payslip</h3>
      </header>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <div className="bg-dark text-white p-5 w-50">
          {/* Display success message */}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Display error message */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleUpdate} className="row g-3">
            <div className="col-md-3">
              <label className="mb-2">Basic Salary</label>
              <input type="number" className="form-control" name="basic_salary" value={employee.basic_salary || ""} onChange={handleChange} placeholder="Basic Salary" required />
            </div>
            <div className="col-md-3">
              <label className="mb-2">No. of Days</label>
              <input type="number" className="form-control" name="num_days" value={employee.num_days || ""} onChange={handleChange} placeholder="Number of Days Worked" required />
            </div>
            <div className="col-md-3">
              <label className="mb-2">Overtime</label>
              <input type="number" className="form-control" name="over_time" value={employee.over_time || ""} onChange={handleChange} placeholder="Over Time Hours" required />
            </div>
            <div className="col-md-3">
            <label className="mb-2">Bonus</label>
              <input type="number" className="form-control" name="bonus" value={employee.bonus || ""} onChange={handleChange} placeholder="Bonus" required />
            </div>
            <div className="col-md-4">
              <label className="mb-2">Payslip Start Date:</label>
              <input type="date" className="form-control" name="payslip_start" value={employee.payslip_start || ""} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="mb-2">Payslip End Date:</label>
              <input type="date" className="form-control" name="payslip_end" value={employee.payslip_end || ""} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="mb-2">Payslip Period:</label>
              <input type="text" name="payslip_month_year" value={employee.payslip_month_year || ""} readOnly />
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

export default EmployeeUpdatePayslip;
