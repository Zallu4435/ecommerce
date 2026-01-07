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
import { server } from "../../../server";
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
                `${server}/orders/order-details/${orderId}`,
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
                `${server}/orders/${orderId}/cancel/${selectedItem.productId}`,
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
                `${server}/orders/${orderId}/return/${selectedItem.productId}`,
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
                `${server}/orders/${orderId}/cancel-order`,
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
        <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 lg:p-8">
                {/* Header / Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-2 transition-colors"
                        >
                            <FaArrowLeft className="text-sm" />
                            <span className="text-sm font-medium">Back to Orders</span>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Order <span className="text-blue-600 dark:text-blue-400">#{order.orderId}</span>
                        </h1>
                    </div>

                    {order.canCancelOrder && (
                        <button
                            onClick={handleCancelEntireOrder}
                            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-100 dark:border-red-900/30"
                        >
                            Cancel Entire Order
                        </button>
                    )}

                    {(order.paymentStatus === "Failed" || order.orderStatus === "Failed" || order.items.some(item => item.status === "Payment Failed")) && order.paymentMethod?.toLowerCase() !== "cod" && (
                        <button
                            onClick={() => navigate("/retry-payment", {
                                state: {
                                    orderId: order._id,
                                    amount: order.totalAmount
                                }
                            })}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md"
                        >
                            Retry Payment
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaBox className="text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Items in this Order</h2>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="relative shrink-0 w-full sm:w-32 aspect-[3/4] sm:aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                                x{item.quantity}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                                                            {item.productName}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                            {item.color && (
                                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                                                    {item.color}
                                                                </span>
                                                            )}
                                                            {item.size && (
                                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                                                    {item.size}
                                                                </span>
                                                            )}
                                                            {item.gender && (
                                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                                                    {item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                            ₹{item.itemTotal.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            ₹{item.price.toFixed(2)} / unit
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Badges Row */}
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    {/* Offer Badge */}
                                                    {(item.offerInfo?.type !== 'none' || item.originalPrice > item.price) && (
                                                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.offerInfo?.type === 'category'
                                                            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                                                            : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-300'
                                                            }`}>
                                                            <span>{item.offerInfo?.type === 'category' ? '🏷️' : '🎁'}</span>
                                                            <span>
                                                                {item.offerInfo?.percentage
                                                                    ? `${item.offerInfo.percentage}% OFF`
                                                                    : `${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Status Badge */}
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>

                                                    {item.trackingNumber && (
                                                        <span className="text-[10px] text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 font-mono flex items-center gap-1">
                                                            <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                                                            #{item.trackingNumber}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Footer Actions Section */}
                                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                {/* Status Message Line */}
                                                <div className="text-sm">
                                                    {item.cancelledAt ? (
                                                        <div className="text-red-700 dark:text-red-400 flex items-start gap-2">
                                                            <FaTimes className="mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-semibold">Cancelled on {formatDate(item.cancelledAt)}</p>
                                                                {item.cancellationReason && <p className="text-xs opacity-80 mt-0.5">Reason: "{item.cancellationReason}"</p>}
                                                            </div>
                                                        </div>
                                                    ) : item.returnedAt ? (
                                                        <div className="text-orange-700 dark:text-orange-400 flex items-start gap-2">
                                                            <FaBox className="mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-semibold">Returned on {formatDate(item.returnedAt)}</p>
                                                                {item.returnReason && <p className="text-xs opacity-80 mt-0.5">Reason: "{item.returnReason}"</p>}
                                                            </div>
                                                        </div>
                                                    ) : item.deliveredAt ? (
                                                        <div className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                                            <FaCheckCircle className="flex-shrink-0" />
                                                            <span className="font-semibold">Delivered on {formatDate(item.deliveredAt)}</span>
                                                        </div>
                                                    ) : item.shippedAt ? (
                                                        <div className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                                            <FaBox className="flex-shrink-0" />
                                                            <span className="font-semibold">Shipped on {formatDate(item.shippedAt)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                            <FaCalendar className="flex-shrink-0" />
                                                            <span>Placed on {formatDate(item.confirmedAt || order.orderDate)}</span>
                                                        </div>
                                                    )}

                                                    {item.refundAmount > 0 && (
                                                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-md">
                                                            <FaRupeeSign className="text-[10px]" />
                                                            <span>₹{item.refundAmount.toFixed(2)} Refunded <span className="opacity-75">({item.refundStatus})</span></span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions Buttons */}
                                                <div className="flex items-center gap-3 self-end lg:self-auto">
                                                    <InvoiceDownloadIcon
                                                        order={{
                                                            ...order,
                                                            items: [item],
                                                            totalAmount: item.itemTotal,
                                                            subtotal: item.itemTotal,
                                                            couponDiscount: 0,
                                                            status: item.status,
                                                            orderStatus: item.status,
                                                            TotalAmount: item.itemTotal,
                                                            Price: item.price,
                                                            ProductName: item.productName,
                                                            cancellationReason: item.cancellationReason,
                                                            returnReason: item.returnReason
                                                        }}
                                                        className="w-9 h-9 p-2.5 flex items-center justify-center bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-sm transition-all cursor-pointer"
                                                    />

                                                    <button
                                                        onClick={() => handleTrackOrder(item)}
                                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2"
                                                    >
                                                        <span>Track Order</span>
                                                    </button>

                                                    {item.canCancel && (
                                                        <button
                                                            onClick={() => handleCancelItem(item)}
                                                            className="px-5 py-2 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/50 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {item.canReturn && (
                                                        <button
                                                            onClick={() => handleReturnItem(item)}
                                                            className="px-5 py-2 bg-white dark:bg-gray-800 text-amber-600 border border-amber-200 dark:border-amber-900/50 text-xs font-bold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 transition-all"
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Summary & Address */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                        <div className="flex flex-col">
                                            <span className="font-bold">Coupon Applied</span>
                                            <span className="text-xs opacity-75">{order.couponCode || "Discount"}</span>
                                        </div>
                                        <span className="font-bold">-₹{order.couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount</span>
                                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        <InvoiceDownloadIcon
                                            order={order}
                                            className="w-10 h-10 p-2.5 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Full Invoice</span>
                                            <span className="text-[10px] text-gray-500">Download PDF</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <FaCreditCard className="text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{order.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <FaCheckCircle className={`${order.paymentStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.paymentStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Shipping Address</h2>
                            </div>
                            {order.shippingAddress && (
                                <div className="text-sm space-y-3">
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="font-bold text-gray-900 dark:text-white truncate">{order.shippingAddress.fullName || order.shippingAddress.name || order.shippingAddress.username}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{order.shippingAddress.phone}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Street:</span>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {order.shippingAddress.street || order.shippingAddress.addressLine1}
                                            {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">City:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.city}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">State:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.state}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Zip:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.zipCode || order.shippingAddress.pincode}</span>
                                    </div>
                                    {order.shippingAddress.landmark && (
                                        <div className="grid grid-cols-[80px_1fr] gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                            <span className="text-gray-500">Landmark:</span>
                                            <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.landmark}</span>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="text-gray-500">Country:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{order.shippingAddress.country}</span>
                                    </div>
                                </div>
                            )}
                        </div>
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
                productName={selectedItem?.productName}
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
                productName={selectedItem?.productName}
                reason={cancelReason}
                onReasonChange={setCancelReason}
            />

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
