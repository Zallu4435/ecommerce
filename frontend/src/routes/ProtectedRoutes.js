import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="login" replace />;
};

export default ProtectedRoutes;
