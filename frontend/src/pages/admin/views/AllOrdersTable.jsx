import React, { useState, useEffect, useRef } from 'react';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice'; // RTK Query hook for fetching orders
import { useUpdateOrderStatusMutation, useCancelOrderMutation } from '../../../redux/apiSliceFeatures/OrderApiSlice'; // RTK Query hook for updating order status
import { ChevronDown, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../../../modal/user/OrderView';
import CancelConfirmationModal from '../../../modal/user/ConfirmOrderCancelModal';

const OrdersList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState({ orderId: null, productId: null });
  const { data: orders = [], error, isLoading, refetch } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  
  console.log(orders, "orders from admin")
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const toggleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Handle status change via RTK Query mutation
  const handleStatusChange = async (orderId, newStatus, itemsIds) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus, itemsIds }).unwrap();
      refetch(); // Refetch orders after status update
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status');
    }
  };

  // Set up the cancel order and open confirmation modal
  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId });
    setShowModal(true);
  };

  // Handle the confirmation of order cancellation
  const handleConfirmCancel = async () => {
    const { orderId, productId } = orderToCancel;
    setShowModal(false);

    try {
      await cancelOrder({ orderId, productId }).unwrap();
      refetch(); // Refetch orders after cancellation
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order');
    }
  };

  return (
    <div className="max-w-7xl ml-[150px] mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="mb-8 flex items-center justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Your Orders</h2>
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
        <p className="text-center text-gray-600 dark:text-gray-400">You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders?.map((order) => (
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
                      {order.Quantity} {order.Quantity === 1 ? 'Item' : 'Items'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col ml-8 md:flex-row items-start md:items-center gap-3">
                  <StatusDropdown
                    currentStatus={order.Status}
                    onStatusChange={(newStatus) => handleStatusChange(order._id, newStatus, order.itemsIds)}
                    disabled={order.Status === 'Delivered' || order.Status === 'Cancelled'}
                  />
                  <button
                    className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${order.Status === 'Delivered' || order.Status === 'Cancelled' ? 'opacity-40 cursor-not-allowed filter' : ''}`}
                    onClick={() => handleCancelClick(order._id, order.ProductId)} // Ensure ProductId exists
                    disabled={order.Status === 'Delivered' || order.Status === 'Cancelled'}
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
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={closeModal} />}
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

export default OrdersList;

// Status Colors for the dropdown
const statusColors = {
  Pending: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

// Status Dropdown Component
export const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        className={`flex items-center justify-between w-full px-4 py-2 text-md font-bold text-gray-600 ${statusColors[currentStatus]} rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'} focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {currentStatus}
        <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {statuses.map((status) => (
              <button
                key={status}
                className={`${status === currentStatus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
                onClick={() => handleStatusClick(status)}
              >
                <span className={`h-2 w-2 mr-3 rounded-full ${statusColors[status]}`}></span>
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
