import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { adminRoutes } from "../routes/routes";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/Breadcrumb";

const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = useSelector(
    (state) => state.admin.isAdminAuthenticated
  );
  return isAdminAuthenticated ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const AdminLayout = () => {
  return (
    <div className="flex overflow-hidden dark:bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-[420px] ">
        <Breadcrumb />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            {adminRoutes.map(
              (
                { path, component: Component },
                index
              ) => {
                if (path === "*") {
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={<Component notFound={2} />}
                    />
                  );
                }
                return (
                  <Route key={index} path={path} element={<Component />} />
                );
              }
            )}
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
