// import { GrHome } from "react-icons/gr";
// import { IoIosArrowForward } from "react-icons/io";
// import SettingsTheme from "../../components/SettingsTheme";

import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => (
  <div className="flex flex-col dark:bg-black lg:flex-row h-screen text-gray-500 overflow-auto">

    <AdminSidebar />

    {/* Main Content */}
    <div className="flex-1 p-6 sm:p-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[ 
          { title: "Total Users", value: "1,234" },
          { title: "Total Products", value: "$12,345" },
          { title: "Total Orders", value: "23" },
          { title: "Weekly Sales", value: "56" },
        ].map(({ title, value }) => (
          <div
            className="dark:bg-gray-900 bg-orange-50 p-6 rounded-md shadow dark:hover:bg-gray-800 hover:bg-slate-100"
            key={title}
          >
            <p className="text-3xl font-bold dark:text-white">{value}</p>
            <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          </div>
        ))}
      </div>

      {/* Maintenance Section */}
      <div className="mb-8 p-6 dark:bg-gray-900 bg-orange-50 rounded-md">
        <h1 className="text-3xl font-semibold dark:text-white mb-4">Maintenance</h1>
        <div className="space-y-4">
          {["Start Time", "End Time", "Task Name"].map((label, index) => (
            <div key={index}>
              <label className="block text-lg font-medium dark:text-white">{label}</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full mt-1 px-[10px] py-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-lg"
              />
            </div>
          ))}
          <div className="text-right mt-4">
            <button className="dark:bg-blue-500 bg-orange-500 text-white px-8 py-3 rounded-md dark:hover:bg-blue-600 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              ADD
            </button>
          </div>
        </div>
      </div>

      {/* Larger Boxes Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[ 
          {
            title: "Messages",
            value: "$2378",
            prev: "11.38% last month",
            percentage: "+3.5%",
          },
          {
            title: "Orders",
            value: "$56902",
            prev: "11.38% last month",
            percentage: "+3.5%",
          },
          {
            title: "Products",
            value: "$848123",
            prev: "11.38% last month",
            percentage: "+3.5%",
          },
        ].map(({ title, value, prev, percentage }) => (
          <div
            className="dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-lg dark:hover:bg-gray-800 hover:bg-slate-100"
            key={title}
          >
            <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold dark:text-white">{value}</span>
              <span className="text-lg font-bold text-green-500 ml-4">
                {percentage}
              </span>
            </div>
            <p className="text-lg font-bold dark:text-gray-400 text-black">{prev}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
