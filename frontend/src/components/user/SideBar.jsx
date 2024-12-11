import { useNavigate, NavLink } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen, FaKey, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';

const UserSidebar = () => {

  const navigate = useNavigate();

  const menuItems = [
    { to: '/profile', icon: FaUserCircle, label: 'Profile Overview' },
    { to: '/profile/order', icon: FaBoxOpen, label: 'My Orders' },
    { to: '/profile/password', icon: FaKey, label: 'Change Password' },
    { to: '/profile/address', icon: FaMapMarkerAlt, label: 'Add Address' },
  ];

  return (
    <div className="flex flex-col h-[500px] w-full md:w-[350px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg overflow-y-auto">
      <div className="text-2xl font-semibold mb-8 flex items-center gap-2">
        <span className="text-blue-500 dark:text-yellow-400">User</span> Dashboard
      </div>

      {/* Profile Section */}
      <div className="space-y-6 flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center text-lg gap-4 px-4 py-2 rounded-md transition duration-300 ${
                isActive
                  ? 'bg-blue-100 dark:bg-yellow-500 text-blue-700 dark:text-black'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-yellow-400'
              }`
            }
          >
            <item.icon className="text-xl" />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-red-500 dark:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-600 dark:hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
