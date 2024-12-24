import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing a close icon
import { useCancelIndividualOrderMutation } from '../../redux/apiSliceFeatures/OrderApiSlice';
import { toast } from 'react-toastify';
import { useGetOrdersQuery } from '../../redux/apiSliceFeatures/addressPasswordApiSlice';

const OrderDetailsModal = ({ order, onClose, onAllItemsCancelled }) => {
  const [cancelIndividualOrder] = useCancelIndividualOrderMutation(); // Hook for canceling an item
  const [orderState, setOrderState] = useState(order); // Create a local state to manage the order items and their statuses
  const { refetch } = useGetOrdersQuery();
  const [allCancelled, setAllCancelled] = useState(false); // Track if all items have been cancelled

  // Handle individual item cancellation
  const handleCancelOrder = async (productId) => {
    try {
      // Call the cancel order mutation
      await cancelIndividualOrder({ orderId: orderState._id, productId }); // Call mutation with orderId and productId

      // Update the item's status locally to 'Cancelled' without needing a full re-fetch
      const updatedItems = orderState.Items.map(item => 
        item.ProductId === productId ? { ...item, Status: 'Cancelled' } : item
      );
      setOrderState({ ...orderState, Items: updatedItems }); // Update the order state with new item statuses
      refetch();
      toast.success('Item cancelled');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel item');
    }
  };

  const handleClose = () => {
    refetch();
    onClose();
  };

  // Effect to check if all items are cancelled and trigger the callback once
  useEffect(() => {
    // Check if all items are cancelled
    const allItemsCancelled = orderState.Items.every(item => item.Status === 'Cancelled');
    
    if (allItemsCancelled && !allCancelled) {
      onAllItemsCancelled(orderState._id); // Trigger full order cancellation if all items are cancelled
      setAllCancelled(true); // Prevent triggering the callback again
    }
  }, [orderState.Items, orderState._id, allCancelled, onAllItemsCancelled]); // Trigger only if all items are cancelled

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
          onClick={handleClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Order Items</h2>
        <ul className="space-y-4">
          {orderState.Items.map((item, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <img
                  src={item.ProductImage}
                  alt={item.ProductName}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.ProductName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.Quantity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status: {item.Status}</p>
                </div>
              </div>
              {/* Disable the Cancel button if the item status is 'Cancelled' */}
              <button
                onClick={() => handleCancelOrder(item.ProductId)} // Trigger cancel item
                className={`bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ${item.Status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={item.Status === 'Cancelled'} // Disable the cancel button
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
