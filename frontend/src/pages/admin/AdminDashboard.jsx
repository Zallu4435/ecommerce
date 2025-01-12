import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetMetricsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [metricType, setMetricType] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const {
    data: stats,
    isLoading,
    isError,
  } = useGetMetricsQuery({
    type: metricType,
    year: selectedYear,
    month: selectedMonth,
  });

  if (isLoading) {
    return (
      <p className="text-center text-gray-700 dark:text-white">Loading...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Error loading data. Please try again later.
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-center text-gray-700 dark:text-white">
        No data available.
      </p>
    );
  }

  const handleMetricChange = (event) => {
    setMetricType(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
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

  const chartData = {
    labels:
      metricType === "monthly"
        ? months
        : ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label:
          metricType === "monthly"
            ? "Monthly Sales (₹)"
            : metricType === "weekly"
            ? "Weekly Sales (₹)"
            : "Yearly Sales (₹)",
        data: [parseFloat(stats?.totalRevenue) || 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "#B0B0B0",
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 20,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        hoverBorderColor: "#36A2EB",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#B0B0B0",
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#B0B0B0",
        borderColor: "#B0B0B0",
        borderWidth: 1,
        cornerRadius: 5,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#B0B0B0",
          display: true,
          autoSkip: false,
          font: { size: 12, weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#B0B0B0",
          stepSize: 5000,
          font: { size: 12, weight: "bold" },
        },
        grid: { color: "#B0B0B0" },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 30,
        bottom: 20,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuad",
    },
  };

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

        {metricType !== "weekly" && (
          <div>
            <label className="block text-lg font-medium dark:text-white mb-2 text-center md:text-left">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="p-2 w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
            >
              {[2024, 2023, 2022].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {metricType === "monthly" && (
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          {
            title: "Total Revenue",
            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
            bg: "bg-orange-400",
          },
          {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            bg: "bg-blue-400",
          },
          {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            bg: "bg-green-400",
          },
        ].map(({ title, value, bg }) => (
          <div
            key={title}
            className={`p-6 text-white rounded-lg shadow-lg ${bg} flex flex-col justify-center items-center text-center`}
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-white">
          {metricType === "monthly"
            ? "Monthly Sales"
            : metricType === "weekly"
            ? "Weekly Sales"
            : "Yearly Sales"}
        </h3>
        <div style={{ height: "400px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
