import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { useCancelOrderMutation } from '../../../redux/apiSliceFeatures/OrderApiSlice';
import OrderDetailsModal from '../../../modal/user/OrderView';

const OrdersList = () => {
  const navigate = useNavigate();

  // Fetch orders using RTK Query
  const { data: orders = [], error, isLoading, refetch } = useGetOrdersQuery();
  const [cancelOrder] = useCancelOrderMutation(); // Use the cancel order mutation
  const [selectedOrder, setSelectedOrder] = useState(null); // State to track the selected order for modal

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  // Cancel order function
  const handleCancelOrder = async (orderId) => {
    try {
      // Call the cancel order mutation
      await cancelOrder(orderId).unwrap();
      refetch();
      // Optionally, refetch or update local state to reflect the cancellation
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order');
    }
  };

  // Toggle order details modal visibility
  const toggleOrderDetails = (order) => {
    setSelectedOrder(order); // Open the modal with the selected order details
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null); // Close the modal
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Your Orders</h2>
      <ul className="divide-y divide-gray-300 dark:divide-gray-600">
        {orders.map((order) => (
          <li key={order._id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={order.Items[0]?.ProductImage} // Use the first item's image as the order image
                  alt={order.Items[0]?.ProductName} // Use the first item's name as the alt text
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Order ID: {order._id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.Items.length} {order.Items.length === 1 ? 'Item' : 'Items'} {/* Display the number of items */}
                  </p>
                  <p className={`text-sm font-semibold ${order.Status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {order.Status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => navigate(`/track-order/${order._id}`, { state: { order } })}
                >
                  Track Order
                </button>
                <button
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${order.Status === 'Delivered' || order.Status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={order.Status === 'Delivered' || order.Status === 'Cancelled'} // Disable cancel button if status is Delivered or Cancelled
                >
                  Cancel Order
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  onClick={() => toggleOrderDetails(order)}
                >
                  View Items
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default OrdersList;
