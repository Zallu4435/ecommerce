import { useState, useEffect, useRef } from "react";
import { useGetUsersIndividualOrdersQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import {
  useUpdateOrderStatusMutation,
} from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { ChevronDown, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";
import { useSearchUsersIndividualOrdersQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

const statusColors = {
  Processing: "bg-yellow-200",
  Shipped: "bg-blue-200",
  "Out for Delivery": "bg-orange-200",
  Delivered: "bg-green-200",
  Cancelled: "bg-red-200",
  "Payment Failed": "bg-red-300",
};

const IndividualOrdersOfUsers = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [debouncedSafeSearch, setDebouncedSafeSearch] = useState("");
  const [searchErrorMsg, setSearchErrorMsg] = useState("");

  const location = useLocation();
  const { username, email } = location.state || {};


  const page = currentPage;

  const {
    data: ordersData = { orders: [] },
    error: ordersError,
    isLoading: ordersLoading,
    refetch,
  } = useGetUsersIndividualOrdersQuery({ page, limit, email });

  const {
    data: searchData = { orders: [] },
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchUsersIndividualOrdersQuery(
    { query: debouncedSafeSearch, email },
    {
      skip: !debouncedSafeSearch,
    }
  );

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  const sanitizeQuery = (q) =>
    q
      .replace(/[^\w\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleaned = sanitizeQuery(search);
      if (cleaned.length === 0) {
        setSearchErrorMsg("");
        setDebouncedSafeSearch("");
        setCurrentPage(1);
        return;
      }
      if (cleaned.length < 2) {
        setSearchErrorMsg("Please enter at least 2 characters to search.");
        setDebouncedSafeSearch("");
        setCurrentPage(1);
        return;
      }
      if (cleaned !== search.trim()) {
        setSearchErrorMsg("Some characters were removed for a safer search.");
      } else {
        setSearchErrorMsg("");
      }
      setDebouncedSafeSearch(cleaned);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const displayOrders = debouncedSafeSearch ? searchData?.orders : ordersData.orders;
  const isLoading = ordersLoading || (debouncedSafeSearch && isSearchLoading);
  const error = ordersError || (debouncedSafeSearch && searchError);

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

  const totalPages = ordersData?.totalPages || 1;
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Admin view does not allow direct Cancel/Return; only status updates via dropdown.

  return (
    <div className="max-w-7xl mx-auto overflow-y-hidden p-6 bg-orange-50 dark:bg-gray-800 mt-10 shadow-lg rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-poppins"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Orders</span>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 font-playfair">
            <span className="text-indigo-600">{username}'s</span> Orders
          </h2>
        </div>

        {!debouncedSafeSearch && (
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 sticky overflow-hidden top-0 z-10 py-4">
        <input
          type="text"
          placeholder="Search by product name or category"
          className="w-full p-3 rounded-md border border-gray-600 text-gray-800 dark:text-white dark:bg-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchErrorMsg && (
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">{searchErrorMsg}</p>
        )}
      </div>

      

      {isLoading && (
        <LoadingSpinner />
      )}

      {error && (
        <div className="flex items-center justify-center text-red-500 dark:text-red-400">
          <AlertCircle className="mr-2" />
          <p>
            {error?.data?.message ||
              (typeof error?.error === "string" && error.error) ||
              (error?.status === 400
                ? "Invalid search query. Please refine your search."
                : "Failed to fetch orders. Please try again.")}
          </p>
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
                      {order.ProductName}
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
    "Payment Failed",
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