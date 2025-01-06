import { GrHome } from 'react-icons/gr';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { SettingsTheme } from '../../context/SettingsTheme';
import { useSelector } from 'react-redux';
import { useLogoutAdminMutation } from '../../redux/apiSliceFeatures/AdminApiSlice';
import { FaUser, FaBox, FaShoppingCart, FaListAlt, FaTags, FaChartBar, FaTachometerAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },  // Replaced GrHome with FaTachometerAlt
    { name: 'User Management', icon: <FaUser />, path: '/admin/userManagement' },
    { name: 'Products Management', icon: <FaBox />, path: '/admin/productManagement' },
    { name: 'Orders Management', icon: <FaShoppingCart />, path: '/admin/orderManagement' },
    { name: 'Category Management', icon: <FaListAlt />, path: '/admin/categoryManagement' },
    { name: 'Coupons Management', icon: <FaTags />, path: '/admin/couponManagement' },
    { name: 'Sales Management', icon: <FaChartBar />, path: '/admin/salesManagement' },
  ];
  
  
  
  const admin = useSelector(state => state.admin.admin);
  const [logoutAdmin] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      const response = await logoutAdmin().unwrap();
      console.log( response, 'Logged out successfully');
    
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <>
      {/* Sidebar */}
      <div className="w-full fixed h-screen overflow-auto lg:w-[400px] dark:bg-gray-900 bg-orange-50 p-4">
        {/* Profile Section */}
        <div className="flex items-center mb-6">
          <img
            src={admin?.avatar || "https://via.placeholder.com/50"}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4 dark:text-white text-bl">
            <span className="block text-sm font-bold">PRODUCT MANAGER</span>
            <p className="text-sm">{admin?.username.toUpperCase() || 'Zallu'}</p>
          </div>

          <SettingsTheme />
        </div>

        <hr className="my-4 border-gray-700" />

        {/* Navigation */}
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

        {/* Settings Section - Hover to Show */}
        <div className="relative group my-12">
          <p className='dark:text-gray-50 font-bold text-gray-600'>SETTINGS</p>
          <div className="flex items-center mx-12 cursor-pointer mt-4">
            <span className="text-xl text-gray-300">⚙️</span>
            <span className="ml-4 text-lg font-semibold dark:text-gray-300 text-gray-600">Settings</span>
            <IoIosArrowForward className="text-lg ml-8 dark:text-gray-50" />
          </div>
        </div>

        <div className='flex-col 2xl:mt-0 md:mt-52 xl:mt-52 sm:mt-0'>
            {/* About Section */}
            <div className="flex items-center mb-4">
                <span className="text-xl text-gray-300">ℹ</span>
                <span className="ml-4 text-lg font-semibold dark:text-gray-300 text-gray-600">Help</span>
            </div>

            {/* Logout Section */}
            <div className="flex items-center mb-4">
                <span className="text-xl text-gray-300">🚪</span>
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
