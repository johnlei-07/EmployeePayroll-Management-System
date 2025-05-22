import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // Install with `npm install dayjs`

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      setError("Failed to fetch employee details.");
      console.error("Error fetching employee details:", err);
    }
  };

  // Function to format date
  const formatDate = (date) => {
    return date ? dayjs(date).format("MMMM D, YYYY") : "N/A"; // Example: "March 28, 2025"
  };
   // Function to format payslip period
      const formatPayslipPeriod = (start, end) => {
          if (!start || !end) return "No payslip period set";
  
          const startDate = dayjs(start);
          const endDate = dayjs(end);
  
          if (startDate.month() === endDate.month()) {
              // If both dates are in the same month: "April 1 - 15, 2025"
              return `${startDate.format("MMM D")} - ${endDate.format("D, YYYY")}`;
          } else {
              // If dates span two months: "April 30, 2025 - May 15, 2025"
              return `${startDate.format("MMM D, YYYY")} - ${endDate.format("MMMM D, YYYY")}`;
          }   
      };

  return (
    <section className="gradient-custom">
      <header className="d-flex align-items-center justify-content-between bg-dark">
        <button onClick={() => navigate("/admin/employee-list")} className="btn btn-outline-light mx-3 px-3">Back</button>
        <h3 className="flex-grow-1 text-center text-white m-3">Employee Details</h3>
      </header>

      <div className="d-flex justify-content-center align-items-center mt-4">
      {error && <p style={{ color: "red" }}>{error}</p>}
        {employee ? (
          <div className="card bg-dark text-white w-50">
            <h3 className="card-header border-bottom border-5">Employee Profile</h3>
            <div className="card-body">
              <p><strong>Email: </strong> {employee.email}</p>
              <p><strong>Name: </strong> {employee.lastname}, {employee.firstname}</p>
              <p><strong>Employee ID: </strong> {employee.employee_id}</p>
              <p><strong>Address: </strong> {employee.address}</p>
              <p><strong>Working Status: </strong> {employee.working_status}</p>
              <p><strong>Department: </strong> {employee.department}</p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary px-4" onClick={() => navigate(`/admin/employee-profile/update/${id}`)}>Edit</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="d-flex justify-content-center align-items-center mt-4">
        {employee ? (
          <div className="card bg-dark text-white w-50">
            <h3 className="card-header border-bottom border-5"> Payslip
            <span className="fs-5 ms-2">({formatPayslipPeriod(employee.payslip_start, employee.payslip_end)})</span>
            </h3>
            <div className="card-body">
              <p>Date Posted: {dayjs(employee.created_at).format("MMMM D, YYYY h:mm A")}</p>
              <table className="table table-dark table-stripped ">
              <thead >
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Basic Salary</strong>
                  </td>
                  <td>
                    ${employee.basic_salary}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>No. of Days</strong>
                  </td>
                  <td>
                    {employee.num_days}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Overtime</strong>
                  </td>
                  <td>
                    ${employee.over_time}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Bonus</strong>
                  </td>
                  <td>
                    ${employee.bonus}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    ${employee.total}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Tax Deduction</strong>
                  </td>
                  <td>
                    ${employee.basic_salary}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Insurance Deduction</strong>
                  </td>
                  <td>
                    ${employee.basic_salary}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Net Salary</strong>
                  </td>
                  <td>
                    ${employee.net_salary}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary px-4" onClick={() => navigate(`/admin/employee-payslip/update/${id}`)}>Edit</button>
              </div>
            </div>
          </div>
        ): (
          <p>Loading</p>
        )}
      </div>
    </section>
  );
};

export default EmployeeDetails;
