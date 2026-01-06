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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const location = useLocation();
  const { username, email } = location.state || {};

  console.log('📧 Email from location:', email);

  const page = currentPage;

  const {
    data: ordersData = { orders: [] },
    error: ordersError,
    isLoading: ordersLoading,
    refetch: refetchPaginated,
  } = useGetUsersIndividualOrdersQuery(
    { page, limit, email },
    { skip: !email || Boolean(debouncedSearch) }
  );

  const {
    data: searchData = { orders: [] },
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchUsersIndividualOrdersQuery(
    { query: debouncedSearch, email },
    {
      skip: !debouncedSearch || !email,
    }
  );

  console.log('🔍 Search Query State:', {
    search,
    debouncedSearch,
    email,
    skipCondition: !debouncedSearch || !email,
    willSkip: !debouncedSearch || !email
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏱️ Debounce timer fired, setting debouncedSearch to:', search);
      setDebouncedSearch(search);
      if (search && email) {
        console.log('🔍 Search triggered:', { search, email });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, email]);

  const displayOrders = debouncedSearch ? searchData?.orders : ordersData.orders;
  const isLoading = ordersLoading || (debouncedSearch && isSearchLoading);
  const error = ordersError || (debouncedSearch && searchError);

  console.log('📊 Data State:', {
    debouncedSearch,
    hasSearchData: !!searchData?.orders,
    searchDataLength: searchData?.orders?.length,
    hasOrdersData: !!ordersData?.orders,
    ordersDataLength: ordersData?.orders?.length,
    displayOrdersLength: displayOrders?.length,
    isSearchLoading,
    searchError: searchError?.message || searchError
  });

  const handleStatusChange = async (orderId, newStatus, itemsIds) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        itemsIds,
      }).unwrap();
      if (debouncedSearch) {
        await refetchSearch();
      } else {
        await refetchPaginated();
      }
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
    <div className="dark:bg-gray-900 py-2 h-screen fixed left-[420px] top-10 right-0 dark:text-white bg-orange-50 px-14 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-orange-50 dark:bg-gray-900 py-4 mb-4 flex items-center justify-between">
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

        {!debouncedSearch && (
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1
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
              className={`px-4 py-2 rounded-md ${currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 sticky top-16 z-10 py-4 bg-orange-50 dark:bg-gray-900">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search by product name or category..."
            className="w-full p-3.5 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

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
        <ul className="space-y-4">
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
        className={`flex items-center justify-between w-full px-4 py-2 text-md font-bold dark:text-white ${statusColors[currentStatus]
          } rounded-md ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-opacity-80"
          } focus:outline-none`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {currentStatus}
        <ChevronDown
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""
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
                className={`${status === currentStatus
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