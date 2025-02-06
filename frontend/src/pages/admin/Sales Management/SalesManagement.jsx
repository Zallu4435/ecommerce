import { useState, useCallback } from "react";
import {
  downloadSalesReportPDF,
  downloadSalesReportExcel,
} from "./DownloadUtils";
import { Package, ShoppingCart } from "lucide-react";
import {
  useGetSalesDataQuery,
  useGetSalesOverviewQuery,
  useGetTopSellingProductsQuery,
} from "../../../redux/apiSliceFeatures/SalesApiSlice";
import DateRangeSelector from "./DateRangeSelector";
import Card from "./Card";
import Table from "./Table";
import { FaTags } from "react-icons/fa";

const AdminSalesManagement = () => {
  const [dateRange, setDateRange] = useState("This Week");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  const getQueryParams = useCallback(() => {
    const params = {
      page: 1,
      pageSize: 10,
    };

    if (dateRange === "Custom" && customDates.start && customDates.end) {
      params.dateRange = "Custom";
      params.startDate = customDates.start;
      params.endDate = customDates.end;
    } else {
      params.dateRange = dateRange;
    }

    return params;
  }, [dateRange, customDates]);

  const {
    data: recentOrders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetSalesDataQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

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

  const handleDownloadPDF = () => {
    downloadSalesReportPDF(dateRange, salesOverview, recentOrders, topProducts);
  };

  const handleDownloadExcel = () => {
    downloadSalesReportExcel(
      dateRange,
      salesOverview,
      recentOrders,
      topProducts
    );
  };

  const noOrders = recentOrders?.data?.orders?.length === 0;

  const generateOrderId = (id) => {
    return `ORD-${id.slice(0, 6).toUpperCase()}`;
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Sales Management
          </h1>
          <div className="flex items-center space-x-4">
            <DateRangeSelector
              dateRange={dateRange}
              setDateRange={setDateRange}
              customDates={customDates}
              setCustomDates={setCustomDates}
            />
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div>
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
              title="Total Discount"
              value={`${salesOverview?.couponDiscount.toLocaleString() || 0}`}
              icon={<FaTags />}
              bgColor="purple"
              iconColor="purple"
            />
          </div>

          <Table
            data={
              noOrders
                ? [
                    {
                      "Order ID": (
                        <td
                          className="text-lg col-span-7 font-semibold text-center text-red-600 dark:text-gray-300"
                          colSpan={7}
                        >
                          No orders for{" "}
                          {dateRange === "Today" ? "Today" : dateRange}
                        </td>
                      ),
                      Customer: "",
                      Quantity: "",
                      Total: "",
                      "Payment Type": "",
                      "Discount Amount": "",
                      Status: "",
                    },
                  ]
                : recentOrders?.data?.orders?.map((order) => ({
                    "Order ID": generateOrderId(order._id),
                    Customer: order.customer || "N/A",
                    Quantity: order.quantity || 0,
                    "Payment Type": order.paymentType || "N/A",
                    "Discount Amount": `₹${
                      order.discountAmount?.toLocaleString() || 0
                    }`,
                    Total: `₹${order.total?.toLocaleString() || 0}`,
                    Status: (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "Returned"
                            ? "bg-purple-200 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    ),
                  }))
            }
            columns={[
              "Order ID",
              "Customer",
              "Quantity",
              "Payment Type",
              "Discount Amount",
              "Total",
              "Status",
            ]}
            title="Recent Orders"
          />

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
    </div>
  );
};

export default AdminSalesManagement;
