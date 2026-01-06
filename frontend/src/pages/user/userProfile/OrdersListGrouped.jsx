import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaSort, FaCalendar, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

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
            Delivered: "text-green-600 bg-green-50",
            Shipped: "text-blue-600 bg-blue-50",
            Processing: "text-yellow-600 bg-yellow-50",
            Confirmed: "text-indigo-600 bg-indigo-50",
            Pending: "text-gray-600 bg-gray-50",
            Cancelled: "text-red-600 bg-red-50",
            "Partially Cancelled": "text-orange-600 bg-orange-50",
            "Partially Delivered": "text-teal-600 bg-teal-50",
            Returned: "text-purple-600 bg-purple-50",
            Failed: "text-red-700 bg-red-100",
        };
        return statusColors[status] || "text-gray-600 bg-gray-50";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-7xl mt-8 lg:mt-[-10px] mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    Your Orders
                </h2>
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                    <FaSort className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                    </span>
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20">
                    <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        You have no orders yet.
                    </p>
                </div>
            ) : (
                <>
                    {/* Orders List */}
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/order-details/${order._id}`)}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Left Section - Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            {/* Product Images Preview */}
                                            <div className="flex -space-x-2">
                                                {order.productImages.slice(0, 3).map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt="Product"
                                                        className="w-16 h-16 rounded-lg object-cover border-2 border-white dark:border-gray-800"
                                                    />
                                                ))}
                                                {order.itemCount > 3 && (
                                                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-800">
                                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                            +{order.itemCount - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Order Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                        {order.orderId}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                            order.orderStatus
                                                        )}`}
                                                    >
                                                        {order.orderStatus}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <FaBox className="text-gray-400" />
                                                        <span>
                                                            {order.itemCount}{" "}
                                                            {order.itemCount === 1 ? "Item" : "Items"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendar className="text-gray-400" />
                                                        <span>{formatDate(order.orderDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaRupeeSign className="text-gray-400" />
                                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                            ₹{order.totalAmount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.expectedDeliveryDate && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                        Expected Delivery:{" "}
                                                        {formatDate(order.expectedDeliveryDate)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/order-details/${order._id}`);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        >
                                            <FaEye />
                                            <span className="hidden sm:inline">View Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg ${page === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    } transition`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className={`px-4 py-2 rounded-lg ${page === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    } transition`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrdersListGrouped;
