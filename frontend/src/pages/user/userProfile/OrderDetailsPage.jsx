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
            Delivered: "text-green-600 bg-green-50",
            Shipped: "text-blue-600 bg-blue-50",
            "Out for Delivery": "text-blue-700 bg-blue-100",
            Processing: "text-yellow-600 bg-yellow-50",
            Packed: "text-yellow-700 bg-yellow-100",
            Confirmed: "text-indigo-600 bg-indigo-50",
            Pending: "text-gray-600 bg-gray-50",
            Cancelled: "text-red-600 bg-red-50",
            Returned: "text-purple-600 bg-purple-50",
            "Return Requested": "text-purple-500 bg-purple-50",
            Refunded: "text-green-700 bg-green-100",
        };
        return statusColors[status] || "text-gray-600 bg-gray-50";
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
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                    <FaArrowLeft />
                    <span>Back to Orders</span>
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                Order {order.orderId}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <FaCalendar />
                                    <span>Placed on {formatDate(order.orderDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaBox />
                                    <span>{order.itemCount} Items</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                    order.orderStatus
                                )}`}
                            >
                                {order.orderStatus}
                            </span>
                            {order.canCancelOrder && (
                                <button
                                    onClick={handleCancelEntireOrder}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                >
                                    Cancel Entire Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Order Items
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                                {item.productName}
                                            </h3>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {(item.color || item.size || item.gender) && (
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {[
                                                            item.color,
                                                            item.size,
                                                            item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender
                                                        ].filter(Boolean).join(" | ")}
                                                    </span>
                                                )}
                                                <span>Quantity: {item.quantity}</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    ₹{item.price.toFixed(2)} each
                                                </span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    Total: ₹{item.itemTotal.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>

                                            {/* Item Timeline */}
                                            {(item.confirmedAt ||
                                                item.shippedAt ||
                                                item.deliveredAt ||
                                                item.cancelledAt ||
                                                item.returnedAt) && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                                                        {item.confirmedAt && (
                                                            <p>✓ Confirmed: {formatDate(item.confirmedAt)}</p>
                                                        )}
                                                        {item.shippedAt && (
                                                            <p>✓ Shipped: {formatDate(item.shippedAt)}</p>
                                                        )}
                                                        {item.deliveredAt && (
                                                            <p>✓ Delivered: {formatDate(item.deliveredAt)}</p>
                                                        )}
                                                        {item.cancelledAt && (
                                                            <p>✗ Cancelled: {formatDate(item.cancelledAt)}</p>
                                                        )}
                                                        {item.returnedAt && (
                                                            <p>↩ Returned: {formatDate(item.returnedAt)}</p>
                                                        )}
                                                    </div>
                                                )}

                                            {/* Cancellation/Return Reason */}
                                            {item.cancellationReason && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                                                    Cancellation Reason: {item.cancellationReason}
                                                </p>
                                            )}
                                            {item.returnReason && (
                                                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                                                    Return Reason: {item.returnReason}
                                                </p>
                                            )}

                                            {/* Refund Info */}
                                            {item.refundAmount > 0 && (
                                                <div className="text-sm text-green-600 dark:text-green-400 mb-2">
                                                    <p>
                                                        Refund: ₹{item.refundAmount.toFixed(2)} (
                                                        {item.refundStatus})
                                                    </p>
                                                    {item.refundedAt && (
                                                        <p className="text-xs">
                                                            Refunded on: {formatDate(item.refundedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tracking Number */}
                                            {item.trackingNumber && (
                                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                                    Tracking: {item.trackingNumber}
                                                </p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-3">
                                                {item.canCancel && (
                                                    <button
                                                        onClick={() => handleCancelItem(item)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                                    >
                                                        Cancel Item
                                                    </button>
                                                )}
                                                {item.canReturn && (
                                                    <button
                                                        onClick={() => handleReturnItem(item)}
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
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
                <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Subtotal
                                </span>
                                <span className="font-semibold">
                                    ₹{order.subtotal.toFixed(2)}
                                </span>
                            </div>

                            {order.couponDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon Discount</span>
                                    <span>-₹{order.couponDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {order.refundAmount > 0 && (
                                <div className="flex justify-between text-green-600 mt-2">
                                    <span>Refunded</span>
                                    <span>₹{order.refundAmount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <FaCreditCard />
                                <span>Payment Method: {order.paymentMethod || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <FaCheckCircle className="text-green-500" />
                                <span
                                    className={`${order.paymentStatus === "Completed"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                        }`}
                                >
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {order.expectedDeliveryDate && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Expected Delivery
                                </p>
                                <p className="font-semibold">
                                    {formatDate(order.expectedDeliveryDate)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {order.shippingAddress.name}
                                </p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && (
                                    <p>{order.shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.pincode}
                                </p>
                                <p>Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    )}
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
