import React, { useState } from "react";
import {
  BarChart,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  useGetSalesDataQuery,
  useGetSalesOverviewQuery,
  useGetTopSellingProductsQuery,
} from "../../redux/apiSliceFeatures/SalesApiSlice";

const Card = ({ title, value, icon, bgColor, iconColor }) => (
  <div className="bg-yellow-100 dark:bg-gray-800 rounded-lg shadow p-6 transition transform hover:scale-105">
    <div className="flex items-center">
      <div className={`bg-${bgColor}-500 rounded-full p-3`}>
        {icon &&
          React.cloneElement(icon, {
            className: `h-6 w-6 text-${iconColor}-100`,
          })}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const Table = ({ data, columns, title }) => (
  <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow mb-8">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
    </div>
    <div className="overflow-x-auto">
      <div className="min-h-[200px] max-h-[400px] scrollbar-hidden overflow-y-auto"> {/* Added scroll with min height */}
        <table className="w-full">
          <thead>
            <tr className="bg-yellow-100 dark:bg-gray-700 text-left">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {Object.values(row).map((cell, idx) => (
                  <td
                    key={idx}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminSalesManagement = () => {
  const [dateRange, setDateRange] = useState("This Week");

  const {
    data: recentOrders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetSalesDataQuery({ dateRange }, { refetchOnMountOrArgChange: true });
  const {
    data: salesOverview,
    isLoading: loadingSalesOverview,
    error: errorSalesOverview,
  } = useGetSalesOverviewQuery();
  const {
    data: topProducts,
    isLoading: loadingTopProducts,
    error: errorTopProducts,
  } = useGetTopSellingProductsQuery();

  const handleDateRangeChange = (e) => {
    const selectedDateRange = e.target.value;
    setDateRange(selectedDateRange);
  };

  const noOrders = recentOrders?.orders?.length === 0;

  if (loadingSalesOverview || loadingOrders || loadingTopProducts) {
    return <div>Loading...</div>;
  }

  if (errorSalesOverview || errorOrders || errorTopProducts) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!salesOverview || !recentOrders || !topProducts) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 mt-10 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
            Sales Management
          </h1>
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="appearance-none bg-red-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <div
              className="pointer-events-none absolute flex items-center right-2"
              style={{
                top: "calc(50% - 20px)", // Adjust this value to move the arrow upward
              }}
            >
              <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Revenue"
            value={`₹${salesOverview?.totalRevenue?.toLocaleString() || 0}`}
            icon={
              <div className="bg-red-300 text-white rounded-full p-3 relative">
                <span className="text-2xl font-bold absolute bottom-[34px] left-[40px]">
                  ₹
                </span>
              </div>
            }
            bgColor="blue"
            iconColor="blue"
          />

          <Card
            title="Total Orders"
            value={salesOverview?.totalOrders?.toLocaleString() || 0}
            icon={<ShoppingCart />}
            bgColor="green"
            iconColor="green"
          />
          <Card
            title="Average Order Value"
            value={`₹${
              salesOverview?.averageOrderValue?.toLocaleString() || 0
            }`}
            icon={<Package />}
            bgColor="yellow"
            iconColor="yellow"
          />
          <Card
            title="Conversion Rate"
            value={`${salesOverview?.conversionRate || 0}%`}
            icon={<TrendingUp />}
            bgColor="purple"
            iconColor="purple"
          />
        </div>

        {/* Recent Orders */}
        <Table
          data={
            noOrders
              ? [
                  {
                    "Order ID": (
                      <td
                        className="text-lg col-span-5 font-semibold text-center text-red-600 dark:text-gray-300"
                        colSpan={5} // Ensure this spans the correct number of columns
                      >
                        No orders for{" "}
                        {dateRange === "Today" ? "Today" : dateRange}
                      </td>
                    ),
                    Customer: "",
                    Quantity: "",
                    Total: "",
                    Status: "",
                  },
                ]
              : recentOrders?.orders?.map((order) => ({
                  "Order ID": order._id,
                  Customer: order.customer || "N/A",
                  Quantity: order.quantity || 0,
                  Total: `₹${order.total?.toLocaleString() || 0}`,
                  Status: (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  ),
                }))
          }
          columns={["Order ID", "Customer", "Quantity", "Total", "Status"]}
          title="Recent Orders"
        />

        {/* Top Selling Products */}
        <Table
          data={topProducts?.map((product) => ({
            "Product Name": product._id || "N/A",
            "Total Sales": product.totalSold || 0,
            Revenue: `₹${product.totalRevenue?.toLocaleString() || 0}`,
          }))}
          columns={["Product Name", "Total Sales", "Revenue"]}
          title="Top Selling Products"
        />
      </div>
    </div>
  );
};

export default AdminSalesManagement;
