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
                                    className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        {/* Product Image */}
                                        <div className="relative flex-shrink-0 w-full sm:w-24 aspect-square">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                x{item.quantity}
                                            </div>
                                        </div>

                                        {/* Item Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    ₹{item.itemTotal.toFixed(2)}
                                                </p>
                                            </div>

                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
                                                {[
                                                    `₹${item.price.toFixed(2)} each`,
                                                    item.color,
                                                    item.size,
                                                    item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender
                                                ].filter(Boolean).join(" • ")}
                                            </p>

                                            {/* Offer Badge - inferred if price < originalPrice */}
                                            {item.originalPrice > item.price && (
                                                <div className="inline-block px-2 py-0.5 mb-2 mr-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                                    Offer Applied
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                {item.trackingNumber && (
                                                    <span className="text-[10px] text-gray-500 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono">
                                                        #{item.trackingNumber}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Message */}
                                            <div className="text-xs space-y-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                                                {item.cancelledAt ? (
                                                    <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg flex gap-2">
                                                        <FaTimes className="mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold">Cancelled on {formatDate(item.cancelledAt)}</p>
                                                            {item.cancellationReason && <p className="opacity-80 italic">"{item.cancellationReason}"</p>}
                                                        </div>
                                                    </div>
                                                ) : item.deliveredAt ? (
                                                    <p className="text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5">
                                                        <FaCheckCircle /> Delivered on {formatDate(item.deliveredAt)}
                                                    </p>
                                                ) : item.shippedAt ? (
                                                    <p className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
                                                        <FaBox /> Shipped on {formatDate(item.shippedAt)}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                        <FaCalendar /> Placed on {formatDate(item.confirmedAt || order.orderDate)}
                                                    </p>
                                                )}

                                                {item.refundAmount > 0 && (
                                                    <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                                        <FaRupeeSign className="text-[10px]" />
                                                        <span>₹{item.refundAmount.toFixed(2)} Refunded ({item.refundStatus})</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Actions */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleTrackOrder(item)}
                                                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    Track Order
                                                </button>
                                                <InvoiceDownloadIcon
                                                    order={{ ...order, ...item, Status: item.status, TotalAmount: item.itemTotal, Price: item.price, ProductName: item.productName }}
                                                    className="w-8 h-8 p-2 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-500 hover:text-red-600 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-all cursor-pointer"
                                                />
                                                {item.canCancel && (
                                                    <button
                                                        onClick={() => handleCancelItem(item)}
                                                        className="px-4 py-1.5 bg-white dark:bg-gray-800 text-red-600 border border-red-100 dark:border-red-900/30 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {item.canReturn && (
                                                    <button
                                                        onClick={() => handleReturnItem(item)}
                                                        className="px-4 py-1.5 bg-white dark:bg-gray-800 text-amber-600 border border-amber-100 dark:border-amber-900/30 text-xs font-bold rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                                    >
                                                        Return
                                                    </button>
                                                )}
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
