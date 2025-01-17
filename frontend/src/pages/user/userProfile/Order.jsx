import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../../../redux/apiSliceFeatures/addressPasswordApiSlice";
import {
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../../redux/apiSliceFeatures/OrderApiSlice";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";
import CancelConfirmationModal from "../../../modal/user/ConfirmOrderCancelModal";
import ReturnConfirmationModal from "../../../modal/user/OrderReturnModal";
import { FaEye, FaMapMarkerAlt } from "react-icons/fa";
import { InvoiceDownloadIcon } from "../../admin/Sales Management/DownloadUtils";

const OrdersList = () => {
  const navigate = useNavigate();
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
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch: refetchOrders,
  } = useGetOrdersQuery({ page, limit });
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders , setOrders] = useState([])

  useEffect(() => {
    setOrders(data?.orders|| []);
  },[orders,refetchOrders, data?.orders, navigate])

  const observer = useRef();
  const lastOrderElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (data) {
      setHasMore(data.orders.length === limit);
    }
  }, [data, limit]);

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
      await refetchOrders();
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Failed to cancel order");
    }
  };

  const handleConfirmReturn = async () => {
    const { orderId, productId, reason } = orderToReturn;
    setShowReturnModal(false);

    try {
      await returnOrder({ orderId, productId, reason }).unwrap();
    } catch (err) {
      console.error("Error returning order:", err);
      alert("Failed to return order");
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
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Your Orders
      </h2>
      {orders.length === 0 && !isLoading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You have no orders yet.
        </p>
      ) : (
        <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-300 dark:divide-gray-600 scrollbar-hidden">
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {orders.map((order, index) => (
              <li
                key={order._id}
                ref={index === orders.length - 1 ? lastOrderElementRef : null}
                className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={order.ProductImage}
                      alt={order.ProductName}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
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
                            : "text-yellow-500"
                        }`}
                      >
                        {order.Status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${
                        order.Status === "Delivered" ||
                        order.Status === "Cancelled" ||
                        order.Status === "Returned"  ||
                        order.Status === 'Failed'
                          ? "opacity-40 cursor-not-allowed filter"
                          : ""
                      }`}
                      onClick={() =>
                        handleCancelClick(order._id, order.ProductId)
                      }
                      disabled={
                        order.Status === "Delivered" ||
                        order.Status === "Cancelled" ||
                        order.Status === "Returned"  ||
                        order.Status === 'Failed'
                      }
                    >
                      Cancel Order
                    </button>
                    <button
                      className={`bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition ${
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
                    <button
                      className="bg-gray-500 p-3 rounded-full hover:bg-gray-600 transition"
                      onClick={() => toggleOrderDetails(order)}
                      title="View Items"
                    >
                      <FaEye className="text-white text-2xl" />
                    </button>
                    <div
                      className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition transform hover:scale-110 cursor-pointer"
                      onClick={() =>
                        navigate(`/track-order/${order._id}`, {
                          state: { order },
                        })
                      }
                      title="Track Order"
                    >
                      <FaMapMarkerAlt className="text-blue-500 text-2xl" />
                    </div>
                    <InvoiceDownloadIcon order={order} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
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
