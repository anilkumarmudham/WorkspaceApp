import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login/Login";

// Contractor
import ContractorHome from "../pages/contractor/Home/Home";
import ContractorWeeklyReports from "../pages/contractor/WeeklyReport/WeeklyReports";
import Profile from "../pages/contractor/Profile/Profile";

// Admin
import AdminHome from "../pages/admin/Home/Home";
import AdminWeeklyReports from "../pages/admin/WeeklyReports/WeeklyReports";
import Users from "../pages/admin/Users/Users";

function AppRoutes() {

  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* ===========================
            Contractor Routes
      =========================== */}

      <Route
        path="/contractor/home"
        element={
          <ProtectedRoute allowedRole="contractor">
            <MainLayout
              title="Home"
              role="contractor"
              
            >
              <ContractorHome />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractor/weekly-reports"
        element={
          <ProtectedRoute allowedRole="contractor">
            <MainLayout
              title="Weekly Reports"
              role="contractor"
              
            >
              <ContractorWeeklyReports />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractor/profile"
        element={
          <ProtectedRoute allowedRole="contractor">
            <MainLayout
              title="Profile"
              role="contractor"
              
            >
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ===========================
            Admin Routes
      =========================== */}

      <Route
        path="/admin/home"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout
              title="Dashboard"
              role="admin"
              
            >
              <AdminHome />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/weekly-reports"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout
              title="Weekly Reports"
              role="admin"
              
            >
              <AdminWeeklyReports />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout
              title="Employee Management"
              role="admin"
              
            >
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;