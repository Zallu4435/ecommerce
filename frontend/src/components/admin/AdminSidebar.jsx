import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { SettingsTheme } from "../../context/SettingsTheme";
import { useSelector } from "react-redux";
import { useLogoutAdminMutation } from "../../redux/apiSliceFeatures/AdminApiSlice";
import {
  FaUser,
  FaBox,
  FaShoppingCart,
  FaListAlt,
  FaTags,
  FaChartBar,
  FaTachometerAlt,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.admin);
  const [logoutAdmin] = useLogoutAdminMutation();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    {
      name: "User Management",
      icon: <FaUser />,
      path: "/admin/userManagement",
    },
    {
      name: "Products Management",
      icon: <FaBox />,
      path: "/admin/productManagement",
    },
    {
      name: "Orders Management",
      icon: <FaShoppingCart />,
      path: "/admin/orderManagement",
    },
    {
      name: "Category Management",
      icon: <FaListAlt />,
      path: "/admin/categoryManagement",
    },
    {
      name: "Coupons Management",
      icon: <FaTags />,
      path: "/admin/couponManagement",
    },
    {
      name: "Sales Management",
      icon: <FaChartBar />,
      path: "/admin/salesManagement",
    },
  ];

  const links = [
    { name: "Currency Converter", path: "/admin/currency-converter" },
    { name: "Terms and Conditions", path: "/admin/terms-and-conditions" },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleHelp = async () => {
    navigate("/admin/help");
  };

  return (
    <>
      <div className="w-full fixed h-screen overflow-auto lg:w-[400px] scrollbar-hidden dark:bg-gray-900 bg-orange-50 p-4">
        <div className="flex items-center mb-6">
          <img
            src={admin?.avatar || "https://via.placeholder.com/50"}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4 dark:text-white text-bl">
            <span className="block text-sm font-bold">PRODUCT MANAGER</span>
            <p className="text-sm">
              {admin?.username.toUpperCase() || "Zallu"}
            </p>
          </div>

          <SettingsTheme />
        </div>

        <hr className="my-4 border-gray-700" />

        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center justify-between px-4 py-2 dark:hover:bg-gray-800 hover:bg-slate-100 rounded-md text-lg dark:text-gray-300 dark:hover:text-red-300 hover:text-red-600"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
                <IoIosArrowForward className="text-lg" />
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-4 border-gray-700" />

        <div className="relative px-6 py-4 mb-16 group">
          <div className="flex items-center cursor-pointer">
            <span className="text-xl text-gray-300">⚙️</span>
            <span className="ml-4 text-lg font-semibold dark:text-gray-300 text-gray-400">
              Settings
            </span>
          </div>

          <div className="absolute left-[135px] mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300">
            <ul className="space-y-3">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center justify-between px-4 py-2 dark:hover:bg-gray-800 hover:bg-slate-100 rounded-md text-lg dark:text-gray-300 dark:hover:text-red-300 hover:text-red-600"
                  >
                    <span className="flex items-center space-x-3">
                      {" "}
                      <span className="text-sm text-gray-600 dark:hover:text-gray-50">{item.name}</span>
                    </span>
                    <IoIosArrowForward className="text-lg" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-col 2xl:mt-0 md:mt-52 xl:mt-52 sm:mt-0">
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={handleHelp}
          >
            <span className="text-xl text-blue-400">
              <FaQuestionCircle />
            </span>
            <span className="ml-4 text-lg font-semibold dark:text-blue-300 text-blue-400">
              Help
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-xl text-red-400">
              <FaSignOutAlt />
            </span>
            <span
              onClick={handleLogout}
              className="ml-4 text-lg font-semibold text-red-300 cursor-pointer"
            >
              Logout Account
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
