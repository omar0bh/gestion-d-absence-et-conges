import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Departments from "../pages/Departments";
import Divisions from "../pages/Divisions";
import Services from "../pages/Services";
import Employees from "../pages/Employees";
import LeaveTypes from "../pages/LeaveTypes";
import LeaveBalances from "../pages/LeaveBalances";
import NewLeaveRequest from "../pages/NewLeaveRequest";
import MyLeaveRequests from "../pages/MyLeaveRequests";
import RequestsToValidate from "../pages/RequestsToValidate";
import LeaveRequestDetails from "../pages/LeaveRequestDetails";

import UsersManagement from "../pages/UsersManagement";
import EmployeesManagement from "../pages/EmployeesManagement";
import LeaveBalancesManagement from "../pages/LeaveBalancesManagement";
import LeaveTypesManagement from "../pages/LeaveTypesManagement";
import DepartmentsManagement from "../pages/DepartmentsManagement";
import DivisionsManagement from "../pages/DivisionsManagement";
import ServicesManagement from "../pages/ServicesManagement";

function AppRouter() {
  const orgRoles = [
    "EMPLOYEE",
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ];

  const validatorRoles = [
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ];

  const adminRoles = ["SYSTEM_ADMIN"];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={[...orgRoles, ...adminRoles]}>
                  <Dashboard />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Employee / Organisation pages */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <Departments />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/divisions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <Divisions />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <Services />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <Employees />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-types"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <LeaveTypes />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-balances"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <LeaveBalances />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-leave-request"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <NewLeaveRequest />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leave-requests"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <MyLeaveRequests />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-request-details/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={orgRoles}>
                  <LeaveRequestDetails />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Validators only */}
        <Route
          path="/requests-to-validate"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={validatorRoles}>
                  <RequestsToValidate />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/users-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <UsersManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <EmployeesManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-types-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <LeaveTypesManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/balances-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <LeaveBalancesManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <DepartmentsManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/divisions-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <DivisionsManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/services-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleRoute allowedRoles={adminRoles}>
                  <ServicesManagement />
                </RoleRoute>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;