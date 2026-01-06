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
  useGetTopSellingCategoriesQuery,
  useGetTopSellingBrandsQuery,
  useLazyGetTopSellingProductsQuery,
  useLazyGetSalesDataQuery,
} from "../../../redux/apiSliceFeatures/SalesApiSlice";
import DateRangeSelector from "./DateRangeSelector";
import Card from "./Card";
import Table from "./Table";
import { FaTags } from "react-icons/fa";


const AdminSalesManagement = () => {
  const [dateRange, setDateRange] = useState("This Week");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      pageSize: pageSize,
    };

    if (dateRange === "Custom" && customDates.start && customDates.end) {
      params.dateRange = "Custom";
      params.startDate = customDates.start;
      params.endDate = customDates.end;
    } else {
      params.dateRange = dateRange;
    }

    return params;
  }, [dateRange, customDates, currentPage]);

  const {
    data: recentOrders,
    isLoading: loadingOrders,
    error: errorOrders,
    refetch: refetchOrders
  } = useGetSalesDataQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: salesOverview,
    isLoading: loadingSalesOverview,
    error: errorSalesOverview,
    refetch: refetchOverview
  } = useGetSalesOverviewQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: topProducts,
    isLoading: loadingTopProducts,
    error: errorTopProducts,
    refetch: refetchTopProducts
  } = useGetTopSellingProductsQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: topCategories,
    isLoading: loadingTopCategories,
    error: errorTopCategories,
    refetch: refetchTopCategories
  } = useGetTopSellingCategoriesQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: topBrands,
    isLoading: loadingTopBrands,
    error: errorTopBrands,
    refetch: refetchTopBrands
  } = useGetTopSellingBrandsQuery(getQueryParams(), {
    refetchOnMountOrArgChange: true,
  });

  const [triggerGetTopProducts, { isLoading: isPdfProductsLoading }] = useLazyGetTopSellingProductsQuery();
  const [triggerGetOrders, { isLoading: isPdfOrdersLoading }] = useLazyGetSalesDataQuery();

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsPdfGenerating(true);

      // 1. Fetch ALL products for the report
      const allProducts = await triggerGetTopProducts({ ...getQueryParams(), limit: 0 }).unwrap();

      // 2. Fetch ALL orders for the report
      const allOrders = await triggerGetOrders({ ...getQueryParams(), limit: 0 }).unwrap();

      downloadSalesReportPDF(
        dateRange,
        salesOverview,
        allOrders, // Pass FULL order list
        allProducts,
        topCategories,
        topBrands
      );
    } catch (error) {
      console.error("Failed to generate PDF data", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const allProducts = await triggerGetTopProducts({ ...getQueryParams(), limit: 0 }).unwrap();
      const allOrders = await triggerGetOrders({ ...getQueryParams(), limit: 0 }).unwrap();

      downloadSalesReportExcel(
        dateRange,
        salesOverview,
        allOrders,
        allProducts,
        topCategories,
        topBrands
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = () => {
    refetchOrders();
    refetchOverview();
    refetchTopProducts();
    refetchTopCategories();
    refetchTopBrands();
  };

  const noOrders = recentOrders?.data?.orders?.length === 0;

  const generateOrderId = (id) => {
    return `ORD-${id.slice(0, 6).toUpperCase()}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (recentOrders?.data?.pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  if (loadingSalesOverview || loadingOrders || loadingTopProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (errorSalesOverview || errorOrders || errorTopProducts) { // Note: Adding error checks for new queries might be good too
    return <div className="text-center py-10 text-red-500">Error loading data. Please try again later.</div>;
  }

  // Assuming new queries might error but we still want to show what we have, or handle gracefully.
  // For now, let's keep it simple.

  return (
    <div className="min-h-screen bg-gray-50 mt-10 dark:bg-gray-900 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sales Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 capitalize">
              Overview for {dateRange === "Custom" ? `${customDates.start} - ${customDates.end}` : dateRange}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
              <DateRangeSelector
                dateRange={dateRange}
                setDateRange={setDateRange}
                customDates={customDates}
                setCustomDates={setCustomDates}
              />
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                <span>PDF</span>
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            title="Total Revenue"
            value={`₹${salesOverview?.totalRevenue?.toLocaleString() || 0}`}
            icon={
              <div className="flex items-center justify-center h-full w-full">
                <span className="text-xl font-bold">₹</span>
              </div>
            }
            bgColor="blue"
          />
          <Card
            title="Total Orders"
            value={salesOverview?.totalOrders?.toLocaleString() || 0}
            icon={<ShoppingCart />}
            bgColor="green"
          />
          <Card
            title="Total Discount"
            value={`₹${salesOverview?.couponDiscount?.toLocaleString() || 0
              }`}
            icon={<FaTags />}
            bgColor="purple"
          />
        </div>

        <div className="space-y-8">
          {/* Recent Orders Section */}
          <div>
            <Table
              data={
                noOrders
                  ? [
                    {
                      "Order ID": (
                        <td
                          className="text-lg col-span-7 font-semibold text-center text-gray-500 dark:text-gray-400 py-8"
                          colSpan={7}
                        >
                          No orders found for {dateRange === "Today" ? "Today" : dateRange}
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
                    "Discount Amount": `₹${order.discountAmount?.toLocaleString() || 0
                      }`,
                    Total: `₹${order.total?.toLocaleString() || 0}`,
                    Status: (
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "Delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : order.status === "Returned"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
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

            {/* Pagination Controls */}
            {!noOrders && recentOrders?.data?.pagination && (
              <div className="flex justify-between items-center mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{recentOrders.data.pagination.totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === recentOrders.data.pagination.totalPages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === recentOrders.data.pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Selling Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Performance</h2>
            </div>

            <Table
              data={topProducts?.map((product) => ({
                "Product Name": product._id || "N/A",
                "Total Sales": product.totalSold || 0,
                Revenue: `₹${product.totalRevenue?.toLocaleString() || 0}`,
              }))}
              columns={["Product Name", "Total Sales", "Revenue"]}
              title="Top Selling Products"
            />

            <Table
              data={topCategories?.map((cat) => ({
                "Category": cat.categoryName || "N/A",
                "Items Sold": cat.totalItemsSold || 0,
                Revenue: `₹${cat.totalRevenue?.toLocaleString() || 0}`,
              }))}
              columns={["Category", "Items Sold", "Revenue"]}
              title="Top Selling Categories"
            />

            <div className="lg:col-span-2"> {/* Full width or split if 3rd item */}
              <Table
                data={topBrands?.map((brand) => ({
                  "Brand": brand.brandName || "N/A",
                  "Items Sold": brand.totalItemsSold || 0,
                  Revenue: `₹${brand.totalRevenue?.toLocaleString() || 0}`,
                }))}
                columns={["Brand", "Items Sold", "Revenue"]}
                title="Top Selling Brands"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesManagement;
