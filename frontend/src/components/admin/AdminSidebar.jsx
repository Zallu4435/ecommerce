import { GrHome } from 'react-icons/gr';
import { IoIosArrowForward } from 'react-icons/io';
import { SettingsTheme } from '../SettingsTheme'


const AdminSidebar = () => {

  return (
    <div>
      {/* Sidebar */}
      <div className="w-full h-full lg:w-[400px] dark:bg-gray-900 bg-orange-50 p-4">
        {/* Profile Section */}
        <div className="flex items-center mb-6">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4 dark:text-white text-bl">
            <span className="block text-sm font-bold">PRODUCT MANAGER</span>
            <p className="text-sm">Name</p>
          </div>

          <SettingsTheme />

        </div>

        <hr className="my-4 border-gray-700" />

        {/* Navigation */}
        <ul className="space-y-3">
          {/* Dashboard & Other Sections */}
          {[
            { name: 'Dashboard', icon: <GrHome /> },
            { name: 'User Management', icon: <GrHome /> },
            { name: 'Products Management', icon: <GrHome /> },
            { name: 'Orders Management', icon: <GrHome /> },
            { name: 'Category Management', icon: <GrHome /> },
            { name: 'Coupons Management', icon: <GrHome /> },
          ].map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className="flex items-center justify-between px-4 py-2 dark:hover:bg-gray-800 hover:bg-slate-100 rounded-md text-lg dark:text-gray-300 dark:hover:text-red-300 hover:text-red-600"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
                <IoIosArrowForward className="text-lg" />
              </a>
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

          {/* Settings container that is always visible when hovered */}
          {/* <div className="absolute hidden left-[210px] top-[50px] group-hover:block p-5 bg-gray-800 text-white dark:text-black dark:bg-orange-50 rounded-md cursor-pointer">
            <SettingsTheme />
          </div> */}
        </div>

        <div className=' flex-col 2xl:mt-52 md:mt-52 xl-mt--52 sm:mt-0'>
            {/* About Section */}
            <div className="flex items-center mb-4">
                <span className="text-xl text-gray-300">ℹ</span>
                <span className="ml-4 text-lg font-semibold dark:text-gray-300 text-gray-600">Help</span>
            </div>

                {/* Logout Section */}
            <div className="flex items-center mb-4">
                <span className="text-xl text-gray-300">🚪</span>
                <span className="ml-4 text-lg font-semibold text-red-300">Logout Account</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
