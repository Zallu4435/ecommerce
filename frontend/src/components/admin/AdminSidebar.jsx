import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SettingsTheme } from "../../context/SettingsTheme";
import { defaultProfile } from "../../assets/images/index";
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
  const location = useLocation();
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
      <div className="w-full fixed h-screen overflow-auto lg:w-[400px] scrollbar-hidden dark:bg-gray-900 bg-orange-50 p-4 flex flex-col">
        <div>
          <div className="flex items-center mb-6">
            <img
              src={admin?.avatar || defaultProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProfile;
              }}
            />
            <div className="ml-4 dark:text-white text-bl">
              <span className="block text-sm font-bold">PRODUCT MANAGER</span>
              <p className="text-sm">
                {admin?.username ? admin.username.toUpperCase() : "Admin"}
              </p>
            </div>
            <SettingsTheme />
          </div>

          <hr className="my-4 border-gray-700" />

          <ul className="space-y-4 mb-8">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-2 rounded-md text-lg transition-colors ${
                      isActive
                        ? "bg-slate-200 dark:bg-gray-800 text-red-600 dark:text-red-300"
                        : "dark:text-gray-300 dark:hover:text-red-300 hover:text-red-600 dark:hover:bg-gray-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    <IoIosArrowForward className="text-lg" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <hr className="my-4 border-gray-700" />
        </div>

        {/* Bottom section: settings, help, logout */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="relative px-5 py-4 group">
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
                        <span className="text-sm text-gray-600 dark:hover:text-gray-50">{item.name}</span>
                      </span>
                      <IoIosArrowForward className="text-lg" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center mb-2 cursor-pointer px-6" onClick={handleHelp}>
            <span className="text-xl text-blue-400">
              <FaQuestionCircle />
            </span>
            <span className="ml-4 text-lg font-semibold dark:text-blue-300 text-blue-400">
              Help
            </span>
          </div>

          <div className="flex items-center cursor-pointer px-6" onClick={handleLogout}>
            <span className="text-xl text-red-400">
              <FaSignOutAlt />
            </span>
            <span className="ml-4 text-lg font-semibold text-red-300">
              Logout Account
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
