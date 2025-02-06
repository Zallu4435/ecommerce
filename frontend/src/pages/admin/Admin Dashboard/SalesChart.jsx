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

const SalesChart = ({ metricType, stats }) => {
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

  const processChartData = () => {
    if (!stats?.dailyData) return { labels: [], values: [] };

    if (metricType === "weekly") {
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const today = new Date();
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay())
      );

      const weekData = [...stats.dailyData].filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= startOfWeek && dayDate <= endOfWeek;
      });

      const dailyData = weekDays.map((day, index) => {
        const dayData = weekData.find((item) => {
          const itemDate = new Date(item.date);
          return itemDate.getDay() === index;
        });
        return dayData ? dayData.revenue || 0 : 0;
      });

      return {
        labels: weekDays,
        values: dailyData,
      };
    } else if (metricType === "monthly") {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const daysInMonth = stats.dailyData
        .filter((day) => {
          const date = new Date(day.date);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((acc, day) => {
          const date = new Date(day.date);
          const dayOfMonth = date.getDate();
          acc[dayOfMonth] = (acc[dayOfMonth] || 0) + (day.revenue || 0);
          return acc;
        }, {});

      const days = Object.keys(daysInMonth).sort(
        (a, b) => Number(a) - Number(b)
      );

      return {
        labels: days.map((day) => `Day ${day}`),
        values: days.map((day) => daysInMonth[day]),
      };
    } else {
      const monthlyData = stats.dailyData.reduce((acc, day) => {
        const date = new Date(day.date);
        const month = date.getMonth();
        acc[month] = (acc[month] || 0) + (day.revenue || 0);
        return acc;
      }, {});

      return {
        labels: months,
        values: months.map((_, index) => monthlyData[index] || 0),
      };
    }
  };
  const { labels, values } = processChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: `${
          metricType.charAt(0).toUpperCase() + metricType.slice(1)
        } Sales (₹)`,
        data: values,
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
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toLocaleString()}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#B0B0B0",
          display: true,
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 12, weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        suggestedMax: 10000,
        ticks: {
          color: "#B0B0B0",
          callback: (value) => `₹${value.toLocaleString()}`,
          font: { size: 12, weight: "bold" },
        },
        grid: { color: "#B0B0B0" },
        beginAtZero: true,
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
    <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-white">
        {`${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Sales`}
      </h3>
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SalesChart;
