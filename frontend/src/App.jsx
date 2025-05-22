import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// COMPONENTS
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CreateEmployee from "./components/CreateEmployee";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDetails from "./components/EmployeeDetails";
import EmployeeUpdateProfle from "./components/EmployeeUpdateProfile";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployeeUpdatePayslip from "./components/EmployeeUpdatePayslip"


function App(){
  return(
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/create-employee" element={<CreateEmployee />} />
          <Route path="/admin/employee-list" element={<EmployeeTable />} />
          <Route path="/admin/employee/:id" element={<EmployeeDetails />} />
          <Route path="/admin/employee-profile/update/:id" element={<EmployeeUpdateProfle />} />
          <Route path="/admin/employee-payslip/update/:id" element={<EmployeeUpdatePayslip/>}/>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />  


        </Routes>
      </Router>
  )
}
export default App;