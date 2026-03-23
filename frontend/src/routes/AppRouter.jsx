import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {[
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/departments", element: <Departments /> },
          { path: "/divisions", element: <Divisions /> },
          { path: "/services", element: <Services /> },
          { path: "/employees", element: <Employees /> },
          { path: "/leave-types", element: <LeaveTypes /> },
          { path: "/leave-balances", element: <LeaveBalances /> },
          { path: "/new-leave-request", element: <NewLeaveRequest /> },
          { path: "/my-leave-requests", element: <MyLeaveRequests /> },
          { path: "/requests-to-validate", element: <RequestsToValidate /> },
          { path: "/leave-request-details/:id", element: <LeaveRequestDetails /> },
        ].map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <MainLayout>{route.element}</MainLayout>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;