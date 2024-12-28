import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { useCancelOrderMutation } from '../../../redux/apiSliceFeatures/OrderApiSlice';
import OrderDetailsModal from '../../../modal/user/OrderView';
import CancelConfirmationModal from '../../../modal/user/ConfirmOrderCancelModal';

const OrdersList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState({ orderId: null, productId: null });

  // Fetch orders using RTK Query
  const { data: orders = [], error, isLoading, refetch } = useGetOrdersQuery();
  const [cancelOrder] = useCancelOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;
// Make sure you pass only the primitive values, not the entire object
const handleCancelClick = (orderId, productId) => {
  setOrderToCancel({ orderId, productId });
  setShowModal(true);
};

const handleConfirmCancel = async () => {
  const { orderId, productId } = orderToCancel;
  setShowModal(false);

  try {
    // Ensure you pass only orderId and productId as strings
    await cancelOrder({ orderId, productId }).unwrap();
    refetch();
  } catch (err) {
    console.error('Error canceling order:', err);
    alert('Failed to cancel order');
  }
};


  const toggleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">You have no orders yet.</p>
      ) : (
        <ul className="divide-y divide-gray-300 dark:divide-gray-600">
          {orders.map((order) => (
            <li key={order._id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={order.ProductImage}
                    alt={order.ProductName}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.Quantity} {order.Quantity === 1 ? 'Item' : 'Items'}
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
                    className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${order.Status === 'Delivered' || order.Status === 'Cancelled' ? 'opacity-40 cursor-not-allowed filter' : ''}`}
                    onClick={() => handleCancelClick(order._id, order.ProductId)} // Ensure ProductId exists
                    disabled={order.Status === 'Delivered' || order.Status === 'Cancelled'}
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
