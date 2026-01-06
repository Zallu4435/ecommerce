import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaBox,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaCalendar,
    FaCreditCard,
    FaCheckCircle,
    FaUser,
    FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

import StatusDropdown, { STATUS_CONFIG } from "../../components/admin/StatusDropdown";
import CancelReasonModal from "../../modal/admin/CancelReasonModal";

const AdminOrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null); // Track which item is updating

    // Modal state
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [pendingStatusChange, setPendingStatusChange] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/admin/order-details/${orderId}`,
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

    const handleUpdateItemStatus = async (itemId, newStatus) => {
        // If status is Cancelled or Returned, show modal for reason
        if (["Cancelled", "Returned"].includes(newStatus)) {
            setPendingStatusChange({ itemId, newStatus });
            setShowReasonModal(true);
            return;
        }

        // For other statuses, proceed directly
        await updateItemStatus(itemId, newStatus, null);
    };

    const handleConfirmCancellation = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason");
            return;
        }

        const { itemId, newStatus } = pendingStatusChange;
        await updateItemStatus(itemId, newStatus, cancelReason);

        // Reset modal state
        setShowReasonModal(false);
        setCancelReason("");
        setPendingStatusChange(null);
    };

    const updateItemStatus = async (itemId, newStatus, reason) => {
        try {
            setUpdatingStatus(itemId);
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/update-bulk`,
                {
                    orderId: order._id,
                    status: newStatus,
                    itemsIds: [itemId],
                    ...(reason && { reason }),
                },
                { withCredentials: true }
            );

            toast.success("Item status updated successfully!");
            await fetchOrderDetails();
        } catch (error) {
            console.error("Error updating item status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingStatus(null);
        }
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
            <div className="flex justify-center items-center min-h-screen dark:bg-gray-900 bg-orange-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="dark:bg-gray-900 bg-orange-50 min-h-screen p-6">
                <p className="text-center text-gray-600">Order not found</p>
            </div>
        );
    }

    return (
        <div className="dark:bg-gray-900 bg-orange-50 min-h-screen fixed left-[420px] top-10 right-0 bottom-0 overflow-y-auto px-14 py-6 scrollbar-hidden">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold"
                >
                    <FaArrowLeft />
                    <span>Back to Orders</span>
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    Order {order.orderId}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_CONFIG[order.orderStatus]?.color || "bg-gray-100 text-gray-600"}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-default">
                                    <FaUser size={12} />
                                    <span>{order.userName} ({order.userEmail})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaCalendar size={12} />
                                    <span>Placed on {formatDate(order.orderDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Amount</p>
                                <p className="text-2xl font-black text-blue-600">₹{order.totalAmount.toFixed(2)}</p>
                            </div>
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
                                                {item.color && item.size && (
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {item.color} | {item.size}
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

                                            {/* Status Dropdown */}
                                            <div className="mb-3">
                                                <StatusDropdown
                                                    currentStatus={item.status}
                                                    onStatusChange={(newStatus) =>
                                                        handleUpdateItemStatus(item.itemId, newStatus)
                                                    }
                                                    isLoading={updatingStatus === item.itemId}
                                                />
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

                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="w-16 flex-shrink-0 text-gray-500">Name:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{order.shippingAddress.name}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="w-16 flex-shrink-0 text-gray-500">Street:</span>
                                    <span>
                                        {order.shippingAddress.street || order.shippingAddress.addressLine1}
                                        {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                    </span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="w-16 flex-shrink-0 text-gray-500">City:</span>
                                    <span>{order.shippingAddress.city}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="w-16 flex-shrink-0 text-gray-500">State:</span>
                                    <span>{order.shippingAddress.state}</span>
                                </div>
                                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="w-16 flex-shrink-0 text-gray-500">Zip:</span>
                                    <span>{order.shippingAddress.zipCode || order.shippingAddress.pincode}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-16 flex-shrink-0 text-gray-500">Phone:</span>
                                    <span>{order.shippingAddress.phone}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancellation Reason Modal */}
            <CancelReasonModal
                show={showReasonModal}
                onClose={() => {
                    setShowReasonModal(false);
                    setCancelReason("");
                    setPendingStatusChange(null);
                }}
                onConfirm={handleConfirmCancellation}
                orderId={order?.orderId}
                productId={pendingStatusChange?.itemId}
                productName={order?.items?.find(item => item.itemId === pendingStatusChange?.itemId)?.productName}
                productImage={order?.items?.find(item => item.itemId === pendingStatusChange?.itemId)?.productImage}
                reason={cancelReason}
                setReason={setCancelReason}
                type={pendingStatusChange?.newStatus === "Returned" ? "Return" : "Cancel"}
            />
        </div>
    );
};

export default AdminOrderDetailsPage;
