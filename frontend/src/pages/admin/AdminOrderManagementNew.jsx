import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaSort, FaCalendar, FaRupeeSign, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const AdminOrderManagementNew = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 10;

    useEffect(() => {
        fetchOrders();
    }, [page, sortOrder]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // This will fetch ALL orders from all users
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/admin/all-orders`,
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
            Delivered: "bg-green-100 text-green-800",
            Shipped: "bg-blue-100 text-blue-800",
            Processing: "bg-yellow-100 text-yellow-800",
            Confirmed: "bg-indigo-100 text-indigo-800",
            Pending: "bg-gray-100 text-gray-800",
            Cancelled: "bg-red-100 text-red-800",
            "Partially Cancelled": "bg-orange-100 text-orange-800",
            "Partially Delivered": "bg-teal-100 text-teal-800",
            "Partially Shipped": "bg-blue-50 text-blue-700",
            Returned: "bg-purple-100 text-purple-800",
            "Partially Returned": "bg-purple-50 text-purple-700",
            Failed: "bg-red-200 text-red-900",
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            order.orderId?.toLowerCase().includes(search) ||
            order.userName?.toLowerCase().includes(search) ||
            order.userEmail?.toLowerCase().includes(search) ||
            order.orderStatus?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="dark:bg-gray-900 py-2 min-h-screen fixed left-[420px] top-10 right-0 bottom-0 dark:text-white bg-orange-50 px-14 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-orange-50 dark:bg-gray-900 py-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Order Management
                    </h1>
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

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, Email, or Status..."
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white dark:bg-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                    <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {searchTerm ? "No orders found matching your search." : "No orders yet."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Orders Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Order Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {order.orderId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {order.userName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {order.userEmail}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100">
                                                    <FaBox className="text-gray-400" />
                                                    <span>{order.itemCount} items</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    <FaRupeeSign className="text-gray-400" />
                                                    <span>₹{order.totalAmount?.toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <FaCalendar className="text-gray-400" />
                                                    <span>{formatDate(order.orderDate)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/order-details/${order._id}`)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                                >
                                                    <FaEye />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Page {page} of {totalPages} • {filteredOrders.length} orders
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

export default AdminOrderManagementNew;
