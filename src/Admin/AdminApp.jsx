import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import PackagesList from "./pages/Packages/PackagesList";
import PackageForm from "./pages/Packages/PackageForm";
import PackagePreview from "./pages/Packages/PackagePreview";
import AuditLog from "./pages/AuditLog/AuditLog";
import AdminManagement from "./pages/Admins/AdminManagement";
import AdminProfile from "./pages/Profile/AdminProfile";
import "./AdminApp.css";

// Protected route: redirects to login if no token
function ProtectedRoute({ children, admin }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function AdminApp() {
  const [admin, setAdmin] = useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try { setAdmin(JSON.parse(stored)); } catch {}
    }
  }, [location]);

  return (
    <div className="admin-shell">
      {/* Sidebar hidden on login page */}
      {!isLoginPage && (
        <Sidebar admin={admin} />
      )}

      <main className={`admin-main${isLoginPage ? " admin-main-login" : ""}`}>
        <Routes>
          <Route path="login" element={<AdminLogin setAdmin={setAdmin} />} />

          <Route path="dashboard" element={
            <ProtectedRoute admin={admin}>
              <AdminDashboard admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="packages" element={
            <ProtectedRoute admin={admin}>
              <PackagesList admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="packages/new" element={
            <ProtectedRoute admin={admin}>
              <PackageForm admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="packages/edit/:id" element={
            <ProtectedRoute admin={admin}>
              <PackageForm admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="packages/preview/:id" element={
            <ProtectedRoute admin={admin}>
              <PackagePreview admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="audit-log" element={
            <ProtectedRoute admin={admin}>
              <AuditLog admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="admins" element={
            <ProtectedRoute admin={admin}>
              <AdminManagement admin={admin} />
            </ProtectedRoute>
          } />

          <Route path="profile" element={
            <ProtectedRoute admin={admin}>
              <AdminProfile admin={admin} setAdmin={setAdmin} />
            </ProtectedRoute>
          } />

          {/* Default: redirect /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminApp;