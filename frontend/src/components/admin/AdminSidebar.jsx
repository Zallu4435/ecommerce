import { Link, useNavigate, useLocation } from "react-router-dom";
import { SettingsTheme } from "../../context/SettingsTheme";
import { defaultProfile } from "../../assets/images/index";
import { useSelector } from "react-redux";
import { useLogoutAdminMutation } from "../../redux/apiSliceFeatures/AdminApiSlice";
import { IoIosArrowForward } from "react-icons/io";
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
  FaStar,
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
    {
      name: "Review Management",
      icon: <FaStar />,
      path: "/admin/reviewManagement",
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
    <aside className="w-[420px] fixed h-screen overflow-hidden dark:bg-gray-900 bg-orange-50 border-r-2 border-gray-300 dark:border-gray-700 flex flex-col z-50 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]">
      {/* Profile Section */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={admin?.avatar || defaultProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 object-cover shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProfile;
              }}
            />
            <div className="dark:text-white text-gray-800">
              <span className="block text-sm font-bold uppercase tracking-wide">PRODUCT MANAGER</span>
              <p className="text-sm font-medium opacity-80">
                {admin?.username ? admin.username.toUpperCase() : "ADMIN"}
              </p>
            </div>
          </div>
          <SettingsTheme />
        </div>
        <hr className="border-gray-700 opacity-30" />
      </div>

      {/* Navigation section */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-6 py-4">
        <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Main Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.name} className="border-b border-gray-700 border-opacity-30 last:border-0 relative">
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-red-600 dark:bg-red-400 rounded-r-full" />
                )}
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-md text-lg transition-colors ${isActive
                    ? "bg-slate-200 dark:bg-gray-800 text-red-600 dark:text-red-300 shadow-inner"
                    : "dark:text-gray-300 dark:hover:text-red-300 hover:text-red-600 dark:hover:bg-gray-800 hover:bg-slate-100"
                    }`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </span>
                  <IoIosArrowForward className="text-lg" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-8 px-4 h-px bg-gray-700 opacity-40"></div>

        <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Advanced Settings</p>
        <div className="space-y-1">
          {links.map((item) => {
            const isActiveLink = location.pathname === item.path;
            return (
              <div key={item.name} className="border-b border-gray-700 border-opacity-30 last:border-0 relative">
                {isActiveLink && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-red-600 dark:bg-red-400 rounded-r-full" />
                )}
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors ${isActiveLink ? "bg-slate-200 dark:bg-gray-800 text-red-600 dark:text-red-300" : ""}`}
                >
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                  <IoIosArrowForward className="text-sm" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer section */}
      <div className="mt-auto p-6 space-y-4 border-t border-gray-700 border-opacity-20">
        <div className="flex items-center cursor-pointer px-4 group" onClick={handleHelp}>
          <span className="text-xl text-blue-400 group-hover:scale-110 transition-transform">
            <FaQuestionCircle />
          </span>
          <span className="ml-4 text-lg font-semibold dark:text-blue-300 text-blue-400">
            Help
          </span>
        </div>

        <div className="flex items-center cursor-pointer px-4 group" onClick={handleLogout}>
          <span className="text-xl text-red-400 group-hover:scale-110 transition-transform">
            <FaSignOutAlt />
          </span>
          <span className="ml-4 text-lg font-semibold text-red-300">
            Logout Account
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
