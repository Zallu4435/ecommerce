import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setScrolled } from "../redux/slice/scrollSlice";
import Header from "../components/user/Header";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import { routes } from "../routes/routes";

const MainLayout = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      dispatch(setScrolled(isScrolled));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const shouldShowFooter = !["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      <Header />
      <Navbar />
      <main className="">
        <Routes>
          {routes.map(({ path, component: Component, isProtected }, index) => {
            if (isProtected) {
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              );
            }
            if (path === "/login" || path === "/signup") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <AuthRoute>
                      <Component />
                    </AuthRoute>
                  }
                />
              );
            }
            return <Route key={index} path={path} element={<Component />} />;
          })}
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
