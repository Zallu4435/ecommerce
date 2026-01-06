import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetOrdersQuery } from "../../../redux/apiSliceFeatures/userProfileApi";
import {
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../../redux/apiSliceFeatures/OrderApiSlice";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";
import CancelConfirmationModal from "../../../modal/user/ConfirmOrderCancelModal";
import ReturnConfirmationModal from "../../../modal/user/OrderReturnModal";
import { FaEye, FaMapMarkerAlt, FaSort, FaBoxOpen, FaChevronRight, FaFileInvoice } from "react-icons/fa";
import { toast } from "react-toastify";
import { InvoiceDownloadIcon } from "../../admin/Sales Management/DownloadUtils";

const OrdersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState({
    orderId: null,
    productId: null,
    reason: "",
  });
  const [orderToReturn, setOrderToReturn] = useState({
    orderId: null,
    productId: null,
    reason: "",
  });
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const limit = 10;

  const { data, error, isLoading, isFetching, refetch } = useGetOrdersQuery({
    page,
    limit,
    sortOrder,
  }, {
    refetchOnMountOrArgChange: true,
  });
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data?.orders) {
      setOrders(data.orders);
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state, refetch]);

  const totalPages = data?.totalPages || 1;

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

  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId, reason: "" });
    setShowCancelModal(true);
  };

  const handleReturnClick = (orderId, productId) => {
    setOrderToReturn({ orderId, productId, reason: "" });
    setShowReturnModal(true);
  };

  const handleCancelReasonChange = (reason) => {
    setOrderToCancel((prev) => ({ ...prev, reason }));
  };

  const handleReturnReasonChange = (reason) => {
    setOrderToReturn((prev) => ({ ...prev, reason }));
  };

  const handleConfirmCancel = async () => {
    const { orderId, productId, reason } = orderToCancel;
    setShowCancelModal(false);

    try {
      await cancelOrder({ orderId, productId, reason }).unwrap();
      setOrders((prev) => {
        const itemIndex = prev.findIndex((item) => item.ProductId === productId && item._id === orderId);
        if (itemIndex > -1) {
          const updatedOrders = [...prev];
          updatedOrders[itemIndex] = { ...updatedOrders[itemIndex], Status: "Cancelled" };
          return updatedOrders;
        }
        return prev;
      });
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleConfirmReturn = async () => {
    const { orderId, productId, reason } = orderToReturn;
    setShowReturnModal(false);

    try {
      await returnOrder({ orderId, productId, reason }).unwrap();
      setOrders((prev) => {
        const itemIndex = prev.findIndex((item) => item.ProductId === productId && item._id === orderId);
        if (itemIndex > -1) {
          const updatedOrders = [...prev];
          updatedOrders[itemIndex] = { ...updatedOrders[itemIndex], Status: "Return Requested" };
          return updatedOrders;
        }
        return prev;
      });
      toast.success("Order return request submitted successfully!");
    } catch (err) {
      console.error("Error returning order:", err);
      toast.error(err?.data?.message || "Failed to return order");
    }
  };

  const toggleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const generateOrderId = (id) => {
    return `ORD-${id.slice(-6).toUpperCase()}`;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Payment Failed":
      case "Failed":
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium animate-pulse">Fetching your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {error?.data?.message || "We couldn't load your orders. Please check your connection and try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-r from-indigo-600 to-indigo-700"
          >
            Try Refreshing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Order History
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Manage your purchases and track your deliveries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-sm group"
          >
            <FaSort className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
          </button>
        </div>
      </div>

      {orders?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-16 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBoxOpen className="text-4xl text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No orders found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our latest products and start shopping!
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 dark:shadow-none bg-gradient-to-r from-indigo-600 to-indigo-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {orders?.map((order, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Status Bar Top */}
                <div className={`h-1.5 w-full ${getStatusStyles(order.Status).split(' ')[0]}`}></div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Product Info */}
                    <div className="flex items-center gap-6">
                      <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={order.ProductImage}
                          alt={order.ProductName}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-3xl shadow-lg ring-4 ring-gray-50 dark:ring-gray-900"
                        />
                        <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                          x{order.Quantity}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                            {generateOrderId(order._id)}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate max-w-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {order.ProductName}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                          Placed on {new Date().toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyles(order.Status)}`}>
                            {order.Status}
                          </span>
                          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent">
                            ₹{(order.TotalAmount || order.Price * order.Quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Secondary buttons */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => toggleOrderDetails(order)}
                          className="flex-1 sm:flex-none p-3.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
                          title="View Details"
                        >
                          <FaEye className="text-xl mx-auto" />
                        </button>
                        <button
                          onClick={() => navigate(`/track-order/${order._id}`, { state: { order } })}
                          className="flex-1 sm:flex-none p-3.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                          title="Track Order"
                        >
                          <FaMapMarkerAlt className="text-xl mx-auto" />
                        </button>
                        <div className="flex-1 sm:flex-none">
                          <InvoiceDownloadIcon
                            order={order}
                            className="w-full sm:w-auto p-3.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-800"
                          />
                        </div>
                      </div>

                      <div className="h-px sm:h-12 w-full sm:w-px bg-gray-100 dark:bg-gray-700 hidden sm:block"></div>

                      <div className="flex flex-col gap-2 w-full sm:w-44">
                        {((order.Status === "Payment Failed" || order.Status === "Failed" || order.paymentStatus === "Failed") && order.PaymentMethod?.toLowerCase() !== "cod") ? (
                          <button
                            onClick={() => navigate("/retry-payment", {
                              state: {
                                orderId: order._id,
                                amount: order.TotalAmount || order.Price * order.Quantity
                              }
                            })}
                            className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none bg-gradient-to-r from-emerald-600 to-teal-600"
                          >
                            Retry Payment
                          </button>
                        ) : order.Status === "Delivered" ? (
                          <button
                            onClick={() => handleReturnClick(order._id, order.ProductId)}
                            disabled={order.Status === "Return Requested" || order.Status === "Returned"}
                            className="w-full py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {order.Status === "Return Requested" ? "Return Pending" : "Return Order"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCancelClick(order._id, order.ProductId)}
                            disabled={["Cancelled", "Returned", "Return Requested", "Shipped"].includes(order.Status)}
                            className="w-full py-3 bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Cancel Order
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/track-order/${order._id}`, { state: { order } })}
                          className="w-full py-2.5 text-xs font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                        >
                          See full update <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6 p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
              Page <span className="text-gray-900 dark:text-white px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">{page}</span> of {totalPages}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
      <CancelConfirmationModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={orderToCancel.orderId}
        productId={orderToCancel.productId}
        reason={orderToCancel.reason}
        onReasonChange={handleCancelReasonChange}
      />
      <ReturnConfirmationModal
        show={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleConfirmReturn}
        orderId={orderToReturn.orderId}
        productId={orderToReturn.productId}
        reason={orderToReturn.reason}
        onReasonChange={handleReturnReasonChange}
      />
    </div>
  );
};

export default OrdersList;
