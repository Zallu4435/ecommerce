import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaBoxOpen,
  FaKey,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaWallet,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useLogoutUserMutation } from "../../redux/apiSliceFeatures/userApiSlice";

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const [isSticky, setIsSticky] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { to: "/profile", icon: FaUserCircle, label: "Profile Overview" },
    { to: "/profile/order", icon: FaBoxOpen, label: "My Orders" },
    { to: "/profile/password", icon: FaKey, label: "Change Password" },
    { to: "/profile/address", icon: FaMapMarkerAlt, label: "Add Address" },
    { to: "/profile/wallet", icon: FaWallet, label: "Wallet" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden transition-all duration-300 ease-in-out fixed top-[80px] right-[44%] z-50 p-4 dark:text-gray-700 text-gray-200
          ${ isSticky ? 'fixed top-[-5px]' : ''}`}
      >
        <FaBars size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-auto w-full md:w-[350px] md:h-[500px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out z-50 md:z-0 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        } md:translate-y-0 md:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-0 left-0 p-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <FaTimes size={24} />
        </button>

        <div className="p-6">
          <div className="text-2xl font-semibold mb-8 flex items-center gap-2 pt-8 md:pt-0">
            <span className="text-blue-500 dark:text-yellow-400">User</span>{" "}
            Dashboard
          </div>

          <div className="space-y-6 flex-grow">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center text-lg gap-4 px-4 py-2 rounded-md transition duration-300 ${
                    isActive
                      ? "bg-blue-100 dark:bg-yellow-500 text-blue-700 dark:text-black"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-yellow-400"
                  }`
                }
              >
                <item.icon className="text-xl" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 dark:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-600 dark:hover:bg-red-700 transition duration-300"
            >
              <FaSignOutAlt />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;