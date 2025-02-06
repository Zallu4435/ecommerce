import { useState } from "react";
import { useGetMetricsQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import {
  useGetTopSellingBrandsQuery,
  useGetTopSellingCategoriesQuery,
} from "../../../redux/apiSliceFeatures/SalesApiSlice";
import Table from "../Sales Management/Table";
import SalesChart from "./SalesChart";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminDashboard = () => {
  const [metricType, setMetricType] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const {
    data: stats,
    isLoading,
    isError,
  } = useGetMetricsQuery({
    type: metricType,
    year: selectedYear,
    month: selectedMonth,
    week: selectedWeek,
  });

  const {
    data: topCategories,
    isLoading: loadingTopCategories,
    error: errorTopCategories,
  } = useGetTopSellingCategoriesQuery();

  const {
    data: topBrands,
    isLoading: loadingTopBrands,
    error: errorTopBrands,
  } = useGetTopSellingBrandsQuery();

  if (isLoading || loadingTopBrands || loadingTopCategories) {
    return <LoadingSpinner />;
  }

  if (isError || errorTopBrands || errorTopCategories) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!stats || !topBrands || !topCategories) {
    return <div>No data available</div>;
  }

  const handleMetricChange = (event) => {
    setMetricType(event.target.value);
    setSelectedWeek(1);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
    setSelectedWeek(1);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getWeeksInMonth = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      week: i + 1,
      label: `Week ${i + 1}`,
    }));
  };

  // const getWeeksInMonth = () => {
  //   const daysInMonth = 31; 
  //   const weeks = Math.ceil(daysInMonth / 7);
  
  //   return Array.from({ length: weeks }, (_, i) => ({
  //     week: i + 1,
  //     label: `Week ${i + 1}`,
  //   }));
  // };
  

  
  const statsData = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      bg: "bg-orange-400",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      bg: "bg-blue-400",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      bg: "bg-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 mt-10 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-700 dark:text-white mb-6">
        Admin Dashboard
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <div>
          <label className="block text-lg font-medium dark:text-white mb-2 text-center md:text-left">
            Select Metric Type
          </label>
          <select
            value={metricType}
            onChange={handleMetricChange}
            className="p-2 w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium dark:text-white mb-2 text-center md:text-left">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
          >
            {[2025, 2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {(metricType === "monthly" || metricType === "weekly") && (
          <div>
            <label className="block text-lg font-medium dark:text-white mb-2 text-center md:text-left">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-2 w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}

        {metricType === "weekly" && (
          <div>
            <label className="block text-lg font-medium dark:text-white mb-2 text-center md:text-left">
              Select Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="p-2 w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
            >
              {getWeeksInMonth().map(({ week, label }) => (
                <option key={week} value={week}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statsData.map(({ title, value, bg }) => (
          <div
            key={title}
            className={`p-6 text-white rounded-lg shadow-lg ${bg} flex flex-col justify-center items-center text-center`}
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <SalesChart metricType={metricType} stats={stats} />

      <div className="mt-7">
        <Table
          data={topBrands?.map((product) => ({
            "Brand Name": product?.brandName || "N/A",
            "Total Sales": product?.totalItemsSold || 0,
            Revenue: `₹${product?.totalRevenue?.toLocaleString() || 0}`,
          }))}
          columns={["Brand Name", "Total Sales", "Revenue"]}
          title="Top Selling Brand"
        />

        <Table
          data={topCategories?.map((product) => ({
            "Category Name": product?.categoryName || "N/A",
            "Total Sales": product?.totalItemsSold || 0,
            Revenue: `₹${product?.totalRevenue?.toLocaleString() || 0}`,
          }))}
          columns={["Category Name", "Total Sales", "Revenue"]}
          title="Top Selling Category"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
