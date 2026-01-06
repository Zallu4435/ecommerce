import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaBox,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaCalendar,
    FaCreditCard,
    FaCheckCircle,
    FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { InvoiceDownloadIcon } from "../../admin/Sales Management/DownloadUtils";
import CancelConfirmationModal from "../../../modal/user/ConfirmOrderCancelModal";
import ReturnConfirmationModal from "../../../modal/user/OrderReturnModal";

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/order-details/${orderId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setOrder(response.data.order);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelItem = (item) => {
        setSelectedItem(item);
        setShowCancelModal(true);
    };

    const handleReturnItem = (item) => {
        setSelectedItem(item);
        setShowReturnModal(true);
    };

    const handleCancelEntireOrder = () => {
        setShowCancelOrderModal(true);
    };

    const confirmCancelItem = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel/${selectedItem.productId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("Item cancelled successfully!");
            setShowCancelModal(false);
            setCancelReason("");
            fetchOrderDetails();
        } catch (error) {
            console.error("Error cancelling item:", error);
            toast.error(error.response?.data?.message || "Failed to cancel item");
        }
    };

    const confirmReturnItem = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/return/${selectedItem.productId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("Return request submitted successfully!");
            setShowReturnModal(false);
            setCancelReason("");
            fetchOrderDetails();
        } catch (error) {
            console.error("Error returning item:", error);
            toast.error(error.response?.data?.message || "Failed to return item");
        }
    };

    const confirmCancelEntireOrder = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel-order`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("Order cancelled successfully!");
            setShowCancelOrderModal(false);
            setCancelReason("");
            fetchOrderDetails();
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            Delivered: "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
            Shipped: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
            "Out for Delivery": "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800",
            Processing: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
            Packed: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
            Confirmed: "text-violet-700 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-100 dark:border-violet-800",
            Pending: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
            Cancelled: "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
            Returned: "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800",
            "Return Requested": "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800",
            Refunded: "text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800",
        };
        return statusColors[status] || "text-gray-600 bg-gray-50 border border-gray-100";
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleTrackOrder = (item) => {
        const mapStatus = (status) => {
            const statusMap = {
                "Confirmed": "Order Placed",
                "Pending": "Order Placed",
                "Packed": "Processing",
                "Processing": "Processing",
                "Shipped": "Shipped",
                "Out for Delivery": "Out for Delivery",
                "Delivered": "Delivered",
                "Cancelled": "Cancelled",
                "Returned": "Returned",
                "Payment Failed": "Payment Failed"
            };
            return statusMap[status] || status;
        };

        const trackOrderData = {
            _id: order._id,
            Status: mapStatus(item.status),
            Quantity: item.quantity,
            TotalAmount: item.itemTotal,
            Subtotal: item.itemTotal,
            CouponDiscount: 0,
            ProductName: item.productName,
            ProductImage: item.productImage,
            deliveryDate: formatDate(item.deliveredAt || order.expectedDeliveryDate),
            offerPrice: item.price,
            itemsIds: [item.productId],
            orderId: order.orderId,
            originalStatus: item.status
        };
        navigate(`/track-order/${order._id}`, { state: { order: trackOrderData } });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <p className="text-center text-gray-600">Order not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit"
                >
                    <FaArrowLeft className="text-sm" />
                    <span className="font-medium">Back to Orders</span>
                </button>

                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    Order #{order.orderId}
                                </h1>
                                <span
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusColor(
                                        order.orderStatus
                                    )}`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <FaCalendar className="text-gray-400" />
                                    <span>Placed: <span className="font-semibold text-gray-900 dark:text-gray-200">{formatDate(order.orderDate)}</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <FaBox className="text-gray-400" />
                                    <span>Items: <span className="font-semibold text-gray-900 dark:text-gray-200">{order.itemCount}</span></span>
                                </div>
                            </div>
                        </div>

                        {order.canCancelOrder && (
                            <button
                                onClick={handleCancelEntireOrder}
                                className="px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all font-semibold text-sm border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md"
                            >
                                Cancel Entire Order
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <span className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <FaBox className="text-blue-600 dark:text-blue-400" />
                            </span>
                            Items in this Order
                        </h2>

                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="group bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900 transition-colors duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="relative flex-shrink-0 w-full sm:w-32">
                                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            {/* Quantity Badge */}
                                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                                                x{item.quantity}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                                                        ₹{item.itemTotal.toFixed(2)}
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    {[
                                                        item.price > 0 && `₹${item.price} each`,
                                                        item.color,
                                                        item.size,
                                                        item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender
                                                    ].filter(Boolean).join(" • ")}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                                        {item.status}
                                                    </span>

                                                    {item.trackingNumber && (
                                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                            #{item.trackingNumber}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Timeline / Additional Info */}
                                                <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                                    {item.confirmedAt && !item.cancelledAt && (
                                                        <div className="flex items-center gap-2">
                                                            <FaCheckCircle className="text-green-500 text-xs" />
                                                            <span>Confirmed on {formatDate(item.confirmedAt)}</span>
                                                        </div>
                                                    )}
                                                    {item.shippedAt && (
                                                        <div className="flex items-center gap-2">
                                                            <FaCheckCircle className="text-blue-500 text-xs" />
                                                            <span>Shipped on {formatDate(item.shippedAt)}</span>
                                                        </div>
                                                    )}
                                                    {item.deliveredAt && (
                                                        <div className="flex items-center gap-2">
                                                            <FaCheckCircle className="text-green-600 text-xs" />
                                                            <span className="font-medium text-green-700 dark:text-green-400">Delivered on {formatDate(item.deliveredAt)}</span>
                                                        </div>
                                                    )}
                                                    {item.cancelledAt && (
                                                        <div className="flex items-start gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                                            <FaTimes className="mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium">Cancelled on {formatDate(item.cancelledAt)}</p>
                                                                {item.cancellationReason && (
                                                                    <p className="text-xs opacity-90 mt-0.5">"{item.cancellationReason}"</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.returnedAt && (
                                                        <div className="flex items-start gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                                                            <FaBox className="mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium">Returned on {formatDate(item.returnedAt)}</p>
                                                                {item.returnReason && (
                                                                    <p className="text-xs opacity-90 mt-0.5">"{item.returnReason}"</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.refundAmount > 0 && (
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                                            <FaRupeeSign className="text-xs" />
                                                            <span>Refunded ₹{item.refundAmount.toFixed(2)} ({item.refundStatus})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <button
                                                    onClick={() => handleTrackOrder(item)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                                >
                                                    <FaBox className="text-sm" /> Track Order
                                                </button>

                                                <div className="flex-none inline-flex items-center justify-center">
                                                    <InvoiceDownloadIcon
                                                        order={{
                                                            ...order,
                                                            ...item,
                                                            Status: item.status,
                                                            TotalAmount: item.itemTotal,
                                                            Price: item.price,
                                                            ProductName: item.productName
                                                        }}
                                                        className="w-11 h-11 p-2.5 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all cursor-pointer"
                                                    />
                                                </div>

                                                {item.canCancel && (
                                                    <button
                                                        onClick={() => handleCancelItem(item)}
                                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        Cancel Item
                                                    </button>
                                                )}

                                                {item.canReturn && (
                                                    <button
                                                        onClick={() => handleReturnItem(item)}
                                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-700 font-medium rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                                    >
                                                        Return Item
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Order Summary & Address */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                            Payment Summary
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">₹{order.subtotal.toFixed(2)}</span>
                            </div>

                            {order.couponDiscount > 0 && (
                                <div className="flex justify-between text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                    <span>Coupon Discount</span>
                                    <span>-₹{order.couponDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                                <span className="text-gray-900 dark:text-white font-medium">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Info</h3>
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                                            <FaCreditCard className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{order.paymentMethod}</p>
                                            <p className={`text-xs font-medium ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {order.paymentStatus}
                                            </p>
                                        </div>
                                    </div>
                                    {order.paymentStatus === 'Completed' && (
                                        <FaCheckCircle className="text-green-500" />
                                    )}
                                </div>
                            </div>

                            {order.expectedDeliveryDate && (
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Expected Delivery</h3>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(order.expectedDeliveryDate)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
                            </span>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Shipping Details
                            </h2>
                        </div>

                        {order.shippingAddress && (
                            <div className="text-sm space-y-3">
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Name:</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{order.shippingAddress.name}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Phone:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{order.shippingAddress.phone}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Street:</span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {order.shippingAddress.street || order.shippingAddress.addressLine1}
                                        {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                    </span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">City:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.city}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">State:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.state}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Zip:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.zipCode || order.shippingAddress.pincode}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Country:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.country}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CancelConfirmationModal
                show={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                }}
                onConfirm={confirmCancelItem}
                orderId={orderId}
                productId={selectedItem?.productId}
                reason={cancelReason}
                onReasonChange={setCancelReason}
            />

            <ReturnConfirmationModal
                show={showReturnModal}
                onClose={() => {
                    setShowReturnModal(false);
                    setCancelReason("");
                }}
                onConfirm={confirmReturnItem}
                orderId={orderId}
                productId={selectedItem?.productId}
                reason={cancelReason}
                onReasonChange={setCancelReason}
            />

            {/* Cancel Entire Order Modal */}
            <CancelConfirmationModal
                show={showCancelOrderModal}
                onClose={() => {
                    setShowCancelOrderModal(false);
                    setCancelReason("");
                }}
                onConfirm={confirmCancelEntireOrder}
                orderId={orderId}
                productId={null}
                reason={cancelReason}
                onReasonChange={setCancelReason}
                title="Cancel Entire Order"
                message="Are you sure you want to cancel all items in this order?"
            />
        </div>
    );
};

export default OrderDetailsPage;
