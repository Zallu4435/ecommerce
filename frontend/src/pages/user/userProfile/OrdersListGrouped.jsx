import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaSort, FaCalendar, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { InvoiceDownloadIcon } from "../../admin/Sales Management/DownloadUtils";

const OrdersListGrouped = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const limit = 10;

    useEffect(() => {
        fetchOrders();
        // Scroll to top of page when changing pagination
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, sortOrder]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/orders-grouped`,
                {
                    params: { page, limit, sort: sortOrder },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
        setPage(1);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            Delivered: "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
            Shipped: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
            Processing: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
            Confirmed: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
            Pending: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
            Cancelled: "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
            "Partially Cancelled": "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800",
            "Partially Delivered": "text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800",
            Returned: "text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-100 dark:border-purple-800",
            Failed: "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
        };
        return statusColors[status] || "text-gray-600 bg-gray-50 border border-gray-100";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Orders</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your recent purchases</p>
                    </div>

                    <button
                        onClick={toggleSortOrder}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                    >
                        <FaSort className="text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                        </span>
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                            <FaBox className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => navigate(`/order-details/${order._id}`)}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left Section - Images */}
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center -space-x-4 overflow-hidden py-2 pl-2">
                                                {order.productImages.slice(0, 3).map((img, idx) => (
                                                    <div key={idx} className="relative w-20 h-20 rounded-xl border-4 border-white dark:border-gray-900 shadow-sm overflow-hidden bg-white dark:bg-gray-800 transition-transform group-hover:scale-105" style={{ zIndex: 10 - idx }}>
                                                        <img
                                                            src={img}
                                                            alt="Product"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {order.itemCount > 3 && (
                                                    <div className="relative w-20 h-20 rounded-xl border-4 border-white dark:border-gray-900 shadow-sm bg-gray-50 dark:bg-gray-800 flex items-center justify-center z-0">
                                                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                            +{order.itemCount - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Middle Section - Order Info */}
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        Order #{order.orderId}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                        <FaCalendar className="text-xs" />
                                                        {formatDate(order.orderDate)}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg text-gray-500">
                                                        <FaBox className="text-xs" />
                                                    </span>
                                                    <span className="font-medium">{order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg text-gray-500">
                                                        <FaRupeeSign className="text-xs" />
                                                    </span>
                                                    <span className="font-bold text-gray-900 dark:text-white">Total: ₹{order.totalAmount.toFixed(2)}</span>
                                                </div>
                                                {order.expectedDeliveryDate && (
                                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                        <span className="bg-green-50 dark:bg-green-900/20 p-1.5 rounded-lg">
                                                            <FaCalendar className="text-xs" />
                                                        </span>
                                                        <span className="font-medium">Delivery: {formatDate(order.expectedDeliveryDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Section - Arrow */}
                                        <div className="flex flex-col sm:flex-row items-center justify-end lg:justify-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-800 lg:border-l-0">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <InvoiceDownloadIcon
                                                    order={order}
                                                    className="w-10 h-10 p-2.5 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 transition-all cursor-pointer"
                                                />
                                            </div>
                                            <button className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-400">
                                                <FaEye />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-10">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${page === 1
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 hover:shadow-sm"
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${page === totalPages
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 hover:shadow-sm"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrdersListGrouped;
