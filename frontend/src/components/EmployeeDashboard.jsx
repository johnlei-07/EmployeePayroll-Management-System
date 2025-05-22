import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Import dayjs for date formatting
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/EmployeeDashboard.css";

const EmployeeDashboard = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:5000/employee/dashboard", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployeeData(response.data);
            } catch (err) {
                setError("Error fetching employee data");
            }
        };

        fetchEmployeeData();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("token");
            navigate("/");
        }
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
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center fw-bold text-white p-3 bg-dark">
                <h1>Employee Dashboard</h1>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            {/* Employee Profile */}
            <div className="d-flex justify-content-center align-items-center mt-4">
                {employeeData ? (
                    <div className="card bg-dark text-white w-50 shadow-lg">
                        <h3 className="card-header border-bottom border-5">Employee Profile</h3>
                        <div className="card-body">
                            <p><strong>Email: </strong> {employeeData.email}</p>
                            <p><strong>Name: </strong> {employeeData.lastname}, {employeeData.firstname}</p>
                            <p><strong>Employee ID: </strong> {employeeData.employee_id}</p>
                            <p><strong>Address: </strong> {employeeData.address}</p>
                            <p><strong>Working Status: </strong> {employeeData.working_status}</p>
                            <p><strong>Department: </strong> {employeeData.department}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-danger">No employee found</p>
                )}
            </div>

            {/* Payslip Section */}
            {employeeData ? (
                <div className="d-flex justify-content-center align-items-center mt-4">
                    <div className="card bg-dark text-white w-50 shadow-lg">
                        <h3 className="card-header border-bottom border-5">
                            Payslip 
                            <span className="fs-5 ms-2">({formatPayslipPeriod(employeeData.payslip_start, employeeData.payslip_end)})</span>
                        </h3>
                        <div className="card-body">
                        <p>Date Posted: {dayjs(employeeData.created_at).format("MMMM D, YYYY h:mm A")}</p>

                        <table className="table table-dark table-stripped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Basic Salary: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.basic_salary}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>No. of Days: </strong>
                                    </td>
                                    <td>
                                        {employeeData.num_days}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Overtime: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.over_time}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Bonus: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.bonus}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Total: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.total}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Tax Deduction: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.tax_deduction}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Insurance Deduction: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.insurance_deduction}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Net Salary: </strong>
                                    </td>
                                    <td>
                                        ${employeeData.net_salary}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No salary set</p>
            )}
        </section>
    );
};

export default EmployeeDashboard;
