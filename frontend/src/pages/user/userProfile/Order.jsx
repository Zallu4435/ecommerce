import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { useCancelOrderMutation } from '../../../redux/apiSliceFeatures/OrderApiSlice';
import OrderDetailsModal from '../../../modal/user/OrderDetailsModal';
import CancelConfirmationModal from '../../../modal/user/ConfirmOrderCancelModal';

const OrdersList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState({ orderId: null, productId: null });
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch orders with pagination
  const { data, error, isLoading, refetch } = useGetOrdersQuery({ page, limit });
  const [cancelOrder] = useCancelOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId });
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    const { orderId, productId } = orderToCancel;
    setShowModal(false);

    try {
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
        <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-300 dark:divide-gray-600 scrollbar-hidden">
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
                      onClick={() => handleCancelClick(order._id, order.ProductId)}
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
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-4 text-gray-800 dark:text-gray-100">
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
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
