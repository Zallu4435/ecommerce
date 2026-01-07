import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesChart = ({ metricType, stats, selectedYear, selectedMonth, selectedWeek }) => {
  const processChartData = () => {
    if (!stats?.dailyData || stats.dailyData.length === 0) {
      return { labels: [], values: [] };
    }

    const dailyData = stats.dailyData;

    if (metricType === "weekly") {
      // For weekly view, show each day of the week
      const labels = dailyData.map((day) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        return `${dayName} ${dayNum}`;
      });

      const values = dailyData.map((day) => day.revenue || 0);

      return { labels, values };
    } else if (metricType === "monthly") {
      // For monthly view, show each day of the month
      const labels = dailyData.map((day) => {
        const date = new Date(day.date);
        return `Day ${date.getDate()}`;
      });

      const values = dailyData.map((day) => day.revenue || 0);

      return { labels, values };
    } else {
      // For yearly view, aggregate by month
      const monthlyData = {};
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Initialize all months with 0
      months.forEach((month, index) => {
        monthlyData[index] = 0;
      });

      // Aggregate revenue by month
      dailyData.forEach((day) => {
        const date = new Date(day.date);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex] += day.revenue || 0;
      });

      return {
        labels: months,
        values: months.map((_, index) => monthlyData[index]),
      };
    }
  };

  const { labels, values } = processChartData();

  // Calculate max value for better Y-axis scaling
  const maxValue = Math.max(...values, 0);
  const suggestedMax = maxValue > 0 ? Math.ceil(maxValue * 1.1) : 10000;

  const chartData = {
    labels,
    datasets: [
      {
        label: `${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Sales (₹)`,
        data: values,
        backgroundColor: "rgba(251, 146, 60, 0.8)", // Orange color
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 2,
        borderRadius: 8,
        barThickness: metricType === "yearly" ? 30 : metricType === "monthly" ? 15 : 40,
        hoverBackgroundColor: "rgba(249, 115, 22, 0.9)",
        hoverBorderColor: "rgba(234, 88, 12, 1)",
        hoverBorderWidth: 3,
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
          color: "#374151",
          font: {
            size: 14,
            weight: "600"
          },
          padding: 15,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 2,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
            }
            return label;
          },
          title: function (context) {
            const label = context[0].label;
            if (metricType === "weekly" || metricType === "monthly") {
              const dataIndex = context[0].dataIndex;
              const dayData = stats.dailyData[dataIndex];
              if (dayData) {
                const date = new Date(dayData.date);
                return date.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }
            }
            return label;
          }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          display: true,
          autoSkip: metricType === "monthly" ? true : false,
          maxRotation: metricType === "monthly" ? 90 : 45,
          minRotation: metricType === "monthly" ? 45 : 0,
          font: {
            size: metricType === "monthly" ? 10 : 12,
            weight: "500"
          },
        },
        grid: {
          display: false,
          drawBorder: false
        },
      },
      y: {
        suggestedMax: suggestedMax,
        ticks: {
          color: "#6B7280",
          callback: (value) => {
            if (value >= 1000000) {
              return `₹${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(1)}K`;
            }
            return `₹${value}`;
          },
          font: {
            size: 12,
            weight: "500"
          },
        },
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false
        },
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  // Generate chart title with date range info
  const getChartTitle = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (metricType === "yearly") {
      return `Sales Overview - ${selectedYear}`;
    } else if (metricType === "monthly") {
      return `Sales Overview - ${monthNames[selectedMonth - 1]} ${selectedYear}`;
    } else {
      return `Sales Overview - Week ${selectedWeek}, ${monthNames[selectedMonth - 1]} ${selectedYear}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {getChartTitle()}
        </h3>
        {stats?.dateRange && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {new Date(stats.dateRange.startDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} - {new Date(stats.dateRange.endDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        )}
      </div>

      {values.length > 0 ? (
        <div style={{ height: "450px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-2 text-lg font-medium">No sales data available for this period</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
