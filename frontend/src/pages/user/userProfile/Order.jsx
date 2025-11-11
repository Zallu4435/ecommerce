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
import { FaEye, FaMapMarkerAlt, FaSort } from "react-icons/fa";
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

  // Refetch orders when navigating from payment failure
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

  if (error) return <p>Error fetching orders: {error.message}</p>;

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
        const d = prev.find((item) => item.ProductId === productId);
        const filtered = prev.filter((item) => item.ProductId !== productId);
        if (d) {
          const updatedItem = { ...d, Status: "Cancelled" };
          const data = [updatedItem, ...filtered];
          return data;
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
        const d = prev.find((item) => item.ProductId === productId);
        const filtered = prev.filter((item) => item.ProductId !== productId);
        if (d) {
          const updatedItem = { ...d, Status: "Returned" };
          const data = [updatedItem, ...filtered];
          return data;
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
    return `ORD-${id.slice(0, 6).toUpperCase()}`;
  };

  return (
    <div className="max-w-6xl mt-8 lg:mt-[-10px] mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
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

      {orders?.length === 0 && !isLoading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="max-h-[70vh] overflow-y-auto scrollbar-hide hover:scrollbar-default">
            <ul className="divide-y divide-gray-300 dark:divide-gray-600">
              {orders?.map((order, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start lg:items-center">
                      <img
                        src={order.ProductImage}
                        alt={order.ProductName}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Order ID: {generateOrderId(order._id)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.Quantity}{" "}
                          {order.Quantity === 1 ? "Item" : "Items"}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            order.Status === "Delivered"
                              ? "text-green-500"
                              : order.Status === "Payment Failed" || order.Status === "Failed"
                              ? "text-red-500"
                              : order.Status === "Cancelled"
                              ? "text-gray-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {order.Status}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Container */}
                    <div className="mt-4 lg:mt-0 lg:flex gap-4">
                      {/* Primary Actions Row (Cancel & Return) */}
                      <div className="flex gap-2 mb-3 lg:mb-0">
                        <button
                          className={`flex-1 lg:flex-none bg-red-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-red-600 transition ${
                            order.Status === "Delivered" ||
                            order.Status === "Cancelled" ||
                            order.Status === "Returned" ||
                            order.Status === "Failed" ||
                            order.Status === "Payment Failed"
                              ? "opacity-40 cursor-not-allowed filter"
                              : ""
                          }`}
                          onClick={() =>
                            handleCancelClick(order._id, order.ProductId)
                          }
                          disabled={
                            order.Status === "Delivered" ||
                            order.Status === "Cancelled" ||
                            order.Status === "Returned" ||
                            order.Status === "Failed" ||
                            order.Status === "Payment Failed"
                          }
                        >
                          Cancel Order
                        </button>
                        <button
                          className={`flex-1 lg:flex-none bg-yellow-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-yellow-600 transition ${
                            order.Status !== "Delivered" ||
                            order.Status === "Returned"
                              ? "opacity-40 cursor-not-allowed filter"
                              : ""
                          }`}
                          onClick={() =>
                            handleReturnClick(order._id, order.ProductId)
                          }
                          disabled={
                            order.Status !== "Delivered" ||
                            order.Status === "Returned"
                          }
                        >
                          Return Order
                        </button>
                      </div>

                      {/* Secondary Actions Row (View, Track, Download) */}
                      <div className="flex justify-start gap-2">
                        {/* Full buttons for larger screens */}
                        <div className="hidden md:flex gap-2">
                          <button
                            className="bg-gray-500 p-2 sm:p-3 rounded-full hover:bg-gray-600 transition"
                            onClick={() => toggleOrderDetails(order)}
                            title="View Items"
                          >
                            <FaEye className="text-white text-lg sm:text-2xl" />
                          </button>
                          <div
                            className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200 transition cursor-pointer"
                            onClick={() =>
                              navigate(`/track-order/${order._id}`, {
                                state: { order },
                              })
                            }
                            title="Track Order"
                          >
                            <FaMapMarkerAlt className="text-blue-500 text-lg sm:text-2xl" />
                          </div>
                          <InvoiceDownloadIcon order={order} />
                        </div>

                        {/* Compact version for smaller screens */}
                        <div className="md:hidden flex items-center gap-2">
                          <button
                            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
                            onClick={() => toggleOrderDetails(order)}
                            title="View"
                          >
                            View Order
                          </button>
                          <button
                            className="bg-blue-100 text-blue-500 px-3 py-2 rounded hover:bg-blue-200 transition"
                            onClick={() =>
                              navigate(`/track-order/${order._id}`, {
                                state: { order },
                              })
                            }
                            title="Track"
                          >
                            Track order
                          </button>
                          <InvoiceDownloadIcon order={order} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keep all the modals and loading state unchanged */}
      {isFetching && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
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
