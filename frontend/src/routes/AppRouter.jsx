import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Departments from "../pages/Departments";
import Divisions from "../pages/Divisions";
import Services from "../pages/Services";
import Employees from "../pages/Employees";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Departments />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/divisions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Divisions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Services />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Employees />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;