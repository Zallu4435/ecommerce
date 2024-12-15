import React from "react";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { adminRoutes } from "../config/routes";
import AdminSidebar from "../components/admin/AdminSidebar";

// Protected Route component to check authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;  // Replace this with actual authentication logic

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AdminLayout = () => {
  return (
    <div className="flex overflow-hidden dark:bg-black">
      <AdminSidebar />
      <main>
        <Routes>
          {/* Wrapper for all Admin routes */}
          <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            {/* Nested routes inside Admin Layout */}
            {adminRoutes.map(({ path, component: Component }, index) => (
              <Route key={index} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
