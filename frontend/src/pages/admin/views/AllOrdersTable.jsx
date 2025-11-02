import { useState, useEffect, useRef } from "react";
import { useParticularUserQuery } from "../../../redux/apiSliceFeatures/userProfileApi";
import {
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { ChevronDown, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";
import { useSearchUsersIndividualOrdersQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import CancelConfirmationModal from "../../../modal/user/ConfirmOrderCancelModal";
import ReturnConfirmationModal from "../../../modal/user/OrderReturnModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const statusColors = {
  Processing: "bg-yellow-200",
  Shipped: "bg-blue-200",
  "Out for Delivery": "bg-orange-200",
  Delivered: "bg-green-200",
  Cancelled: "bg-red-200",
};

const IndividualOrdersOfUsers = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const location = useLocation();
  const { username, email } = location.state || {};


  const page = 1;
  const limit = 10;

  const {
    data: ordersData = { orders: [] },
    error: ordersError,
    isLoading: ordersLoading,
    refetch,
  } = useParticularUserQuery({ page, limit, email });

  const {
    data: searchData = { orders: [] },
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchUsersIndividualOrdersQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const displayOrders = debouncedSearch ? searchData?.orders : ordersData.orders;
  const isLoading = ordersLoading || (debouncedSearch && isSearchLoading);
  const error = ordersError || (debouncedSearch && searchError);

  const handleStatusChange = async (orderId, newStatus, itemsIds) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        itemsIds,
      }).unwrap();
      await refetch();
      toast.success("Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order status:", err.message);
      toast.error(err?.data?.message || "Failed to update order status. Please try again.");
    }
  };

  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId, reason: "" });
    setShowCancelModal(true);
  };

  const handleReturnClick = (orderId, productId) => {
    setOrderToReturn({ orderId, productId, reason: "" });
    setShowReturnModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(orderToCancel).unwrap();
      setShowCancelModal(false);
      await refetch();
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleConfirmReturn = async () => {
    try {
      await returnOrder(orderToReturn).unwrap();
      setShowReturnModal(false);
      await refetch();
      toast.success("Order return request submitted successfully!");
    } catch (err) {
      console.error("Error returning order:", err);
      toast.error(err?.data?.message || "Failed to return order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto overflow-y-hidden p-6 bg-orange-50 dark:bg-gray-800 mt-10 shadow-lg rounded-lg">
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

      <div className="mb-4 sticky overflow-hidden top-0 z-10 py-4">
        <input
          type="text"
          placeholder="Search for Orders"
          className="w-full p-3 rounded-md border border-gray-600 text-gray-800 dark:text-white dark:bg-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <LoadingSpinner />
      )}

      {error && (
        <div className="flex items-center justify-center text-red-500 dark:text-red-400">
          <AlertCircle className="mr-2" />
          <p>Error fetching orders: {error.message}</p>
        </div>
      )}

      {!isLoading && !error && (!displayOrders || displayOrders.length === 0) ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No orders found.
        </p>
      ) : (
        <ul className="space-y-4 max-h-[540px] scrollbar-hidden overflow-y-auto">
          {displayOrders?.map((order) => (
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
                      order.Status === "Cancelled" ||
                      order.Status === "Returned"
                    }
                  />
                  <button
                    className={`bg-red-500 whitespace-nowrap text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${
                      order.Status === "Delivered" ||
                      order.Status === "Cancelled" ||
                      order.Status === "Returned"
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      handleCancelClick(order._id, order.ProductId)
                    }
                    disabled={
                      order.Status === "Delivered" ||
                      order.Status === "Cancelled" ||
                      order.Status === "Returned"
                    }
                  >
                    Cancel Order
                  </button>
                  <button
                    className={`bg-yellow-500 whitespace-nowrap text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition ${
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
                    className="bg-blue-500 whitespace-nowrap text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <CancelConfirmationModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={orderToCancel.orderId}
        productId={orderToCancel.productId}
        reason={orderToCancel.reason}
        onReasonChange={(reason) =>
          setOrderToCancel((prev) => ({ ...prev, reason }))
        }
      />

      <ReturnConfirmationModal
        show={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleConfirmReturn}
        orderId={orderToReturn.orderId}
        productId={orderToReturn.productId}
        reason={orderToReturn.reason}
        onReasonChange={(reason) =>
          setOrderToReturn((prev) => ({ ...prev, reason }))
        }
      />
    </div>
  );
};

const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = [
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Failed"
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
        className={`flex items-center justify-between w-full px-4 py-2 text-md font-bold dark:text-white ${
          statusColors[currentStatus]
        } rounded-md ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-opacity-80"
        } focus:outline-none`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {currentStatus}
        <ChevronDown
          className={`ml-2 h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && !disabled && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          style={{ visibility: "visible", opacity: 1 }}
        >
          <div className="py-1 z-50">
            {statuses.map((status) => (
              <button
                key={status}
                className={`${
                  status === currentStatus
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                } block px-4 py-2 text-sm w-full text-left`}
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

export default IndividualOrdersOfUsers;