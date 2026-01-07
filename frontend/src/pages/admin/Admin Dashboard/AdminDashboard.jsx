import { useState, useEffect, useMemo } from "react";
import { useGetMetricsQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import SalesChart from "./SalesChart";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Card from "../Sales Management/Card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const AdminDashboard = () => {
  const currentDate = new Date();
  const [metricType, setMetricType] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Optimize query params - only send what's needed
  const queryParams = useMemo(() => {
    const params = {
      type: metricType,
      year: selectedYear,
    };

    // Only add month for monthly/weekly views
    if (metricType === "monthly" || metricType === "weekly") {
      params.month = selectedMonth;
    }

    // Only add week for weekly view
    if (metricType === "weekly") {
      params.week = selectedWeek;
    }

    return params;
  }, [metricType, selectedYear, selectedMonth, selectedWeek]);

  const {
    data: stats,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetMetricsQuery(queryParams, {
    // Cache results for 5 minutes
    pollingInterval: 0,
    refetchOnMountOrArgChange: 300, // 5 minutes
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  // Calculate actual weeks in selected month
  const getWeeksInMonth = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let currentWeekStart = 1;
    let weekNumber = 1;

    while (currentWeekStart <= daysInMonth) {
      const weekEnd = Math.min(currentWeekStart + 6, daysInMonth);
      weeks.push({
        week: weekNumber,
        label: `Week ${weekNumber} (${currentWeekStart} -${weekEnd})`,
        startDay: currentWeekStart,
        endDay: weekEnd
      });
      currentWeekStart = weekEnd + 1;
      weekNumber++;
    }

    return weeks;
  };

  const availableWeeks = getWeeksInMonth(selectedYear, selectedMonth);

  // Reset week if it exceeds available weeks when month changes
  useEffect(() => {
    if (selectedWeek > availableWeeks.length) {
      setSelectedWeek(1);
    }
  }, [selectedMonth, selectedYear, selectedWeek, availableWeeks.length]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-orange-50 dark:bg-gray-900 mt-10 p-6 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error loading data</p>
          <p>{error?.data?.message || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-orange-50 dark:bg-gray-900 mt-10 p-6 flex items-center justify-center">
        <div className="text-gray-700 dark:text-white text-lg">No data available</div>
      </div>
    );
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
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate year options (current year and 3 years back)
  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 3; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 0}`,
      icon: <DollarSign />,
      bgColor: "blue",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString('en-IN') || 0,
      icon: <ShoppingCart />,
      bgColor: "green",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString('en-IN') || 0,
      icon: <Package />,
      bgColor: "purple",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString('en-IN') || 0,
      icon: <Users />,
      bgColor: "yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 mt-10 dark:bg-gray-900 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your business performance and analytics
            </p>
          </div>

          {/* Compact Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Loading Indicator */}
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span>Updating...</span>
              </div>
            )}

            {/* Metric Type */}
            <select
              value={metricType}
              onChange={handleMetricChange}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="yearly">📅 Yearly</option>
              <option value="monthly">📆 Monthly</option>
              <option value="weekly">📊 Weekly</option>
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Month - Only show for monthly/weekly */}
            {(metricType === "monthly" || metricType === "weekly") && (
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            )}

            {/* Week - Only show for weekly */}
            {metricType === "weekly" && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {availableWeeks.map(({ week, label }) => (
                  <option key={week} value={week}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {statsData.map(({ title, value, icon, bgColor }) => (
            <Card
              key={title}
              title={title}
              value={value}
              icon={icon}
              bgColor={bgColor}
            />
          ))}
        </div>

        {/* Sales Chart */}
        <SalesChart
          metricType={metricType}
          stats={stats}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedWeek={selectedWeek}
        />

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                More Detailed Analytics Available
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                For detailed sales reports, top-selling products, categories, and brands, visit the <span className="font-semibold">Sales Management</span> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

