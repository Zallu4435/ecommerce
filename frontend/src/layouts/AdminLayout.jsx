import React from "react";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { adminRoutes } from "../routes/routes";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/Breadcrumb"; // Import Breadcrumb

// Protected Route component to check authentication
const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = useSelector(state => state.admin.isAdminAuthenticated); // Replace this with actual authentication logic
  console.log(isAdminAuthenticated, "admin authenticated ");

  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AdminLayout = () => {
  return (
    <div className="flex overflow-hidden dark:bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-[420px] ">
        {/* Breadcrumb added here */}
        <Breadcrumb />

        {/* Routes Configuration */}
        <Routes>
          <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            {adminRoutes.map(({ path, component: Component, isProtected, notFound }, index) => {
              if (path === "*") {
                return (
                  <Route
                    key={index}
                    path={path}
                    element={<Component notFound={2} />} // Passing the `notFound` prop
                  />
                );
              }
              return (
                <Route
                  key={index}
                  path={path}
                  element={<Component />} // Normal route rendering
                />
              );
            })}
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
