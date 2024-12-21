import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setScrolled } from "../redux/slice/scrollSlice";
import Header from "../components/user/Header";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import { routes } from "../config/routes";

const MainLayout = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();

  console.log(isAuthenticated, "isAuthenticated");

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
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <div>
      <Header />
      <Navbar />
      <main>
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
            return <Route key={index} path={path} element={<Component />} />;
          })}
        </Routes>
      </main>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </div>
  );
};

export default MainLayout;
