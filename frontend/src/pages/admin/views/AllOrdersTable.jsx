import React, { useState, useEffect, useRef } from "react";
import { useGetOrdersQuery } from "../../../redux/apiSliceFeatures/addressPasswordApiSlice"; // RTK Query hook for fetching orders
import {
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "../../../redux/apiSliceFeatures/OrderApiSlice"; // RTK Query hooks
import { ChevronDown, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";
import CancelConfirmationModal from "../../../modal/user/ConfirmOrderCancelModal";

const statusColors = {
  Processing: "bg-yellow-200",
  Shipped: "bg-blue-200",
  "Out for Delivery": "bg-orange-200",
  Delivered: "bg-green-200",
  Cancelled: "bg-red-200"
};

const IndividualOrdersOfUsers = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState({
    orderId: null,
    productId: null,
  });
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const { username } = location.state || {}; // Access the username from state

  // Define page and limit (default values or passed props)
  const page = 1;
  const limit = 10;

  const {
    data: orders = [],
    error,
    isLoading,
    refetch,
  } = useGetOrdersQuery({ page, limit });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const navigate = useNavigate();

  const toggleOrderDetails = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const handleStatusChange = async (orderId, newStatus, itemsIds) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        itemsIds,
      }).unwrap();
      refetch(); // Refetch orders after status update
    } catch (err) {
      console.error("Error updating order status:", err.message);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId });
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    const { orderId, productId } = orderToCancel;
    setShowModal(false);

    try {
      await cancelOrder({ orderId, productId }).unwrap();
      refetch(); // Refetch orders after cancellation
    } catch (err) {
      console.error("Error canceling order:", err.message);
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 mt-10 shadow-lg rounded-lg">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 font-playfair">
          <span className="text-indigo-600">{username}'s</span> Orders
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-poppins"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Orders</span>
        </button>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center text-red-500 dark:text-red-400">
          <AlertCircle className="mr-2" />
          <p>Error fetching orders: {error.message}</p>
        </div>
      )}
      {!isLoading && !error && orders?.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You have no orders yet.
        </p>
      ) : (
        <ul className="space-y-4 max-h-[540px] scrollbar-hidden overflow-y-auto">
          {orders?.orders?.map((order) => (
            <li
              key={order._id}
              className="p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition ease-in-out shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <img
                    src={order.ProductImage}
                    alt={order.ProductName}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.Quantity} {order.Quantity === 1 ? "Item" : "Items"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ordered on:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col ml-8 md:flex-row items-start md:items-center gap-3">
                  <StatusDropdown
                    currentStatus={order.Status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(order._id, newStatus, order.itemsIds)
                    }
                    disabled={
                      order.Status === "Delivered" ||
                      order.Status === "Cancelled"
                    }
                  />
                  <button
                    className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${
                      order.Status === "Delivered" ||
                      order.Status === "Cancelled"
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      handleCancelClick(order._id, order.ProductId)
                    }
                    disabled={
                      order.Status === "Delivered" ||
                      order.Status === "Cancelled"
                    }
                  >
                    Cancel Order
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => toggleOrderDetails(order)}
                  >
                    View Items
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
      <CancelConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={orderToCancel.orderId}
        productId={orderToCancel.productId}
      />
    </div>
  );
};

export default IndividualOrdersOfUsers;



const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = [
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusClick = (status) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center justify-between w-full px-4 py-2 text-md font-bold text-white ${statusColors[currentStatus]} rounded-md ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"
        } focus:outline-none`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {currentStatus}
        <ChevronDown
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && !disabled && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          style={{ visibility: "visible", opacity: 1 }}
        >
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status}
                className={`${
                  status === currentStatus
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                } block px-4 py-2 text-sm`}
                onClick={() => handleStatusClick(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

