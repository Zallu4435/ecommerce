import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { useCancelOrderMutation, useReturnOrderMutation } from '../../../redux/apiSliceFeatures/OrderApiSlice';
import OrderDetailsModal from '../../../modal/user/OrderDetailsModal';
import CancelConfirmationModal from '../../../modal/user/ConfirmOrderCancelModal';
import ReturnConfirmationModal from '../../../modal/user/OrderReturnModal';

const OrdersList = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState({ orderId: null, productId: null });
  const [orderToReturn, setOrderToReturn] = useState({ orderId: null, productId: null });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const { data, error, isLoading, isFetching, refetch: refetchOrders } = useGetOrdersQuery({ page, limit });
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = data?.orders || [];

  const observer = useRef();
  const lastOrderElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (data) {
      setHasMore(data.orders.length === limit);
    }
  }, [data, limit]);

  if (error) return <p>Error fetching orders: {error.message}</p>;

  const handleCancelClick = (orderId, productId) => {
    setOrderToCancel({ orderId, productId });
    setShowCancelModal(true);
  };

  const handleReturnClick = (orderId, productId) => {
    setOrderToReturn({ orderId, productId });
    setShowReturnModal(true);
  };

  const handleConfirmCancel = async () => {
    const { orderId, productId } = orderToCancel;
    setShowCancelModal(false);

    try {
      await cancelOrder({ orderId, productId }).unwrap();
      await refetchOrders()
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order');
    }
  };

  const handleConfirmReturn = async () => {
    const { orderId, productId } = orderToReturn;
    setShowReturnModal(false);

    try {
      await returnOrder({ orderId, productId }).unwrap();
      await refetchOrders()
    } catch (err) {
      console.error('Error returning order:', err);
      alert('Failed to return order');
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
      {orders.length === 0 && !isLoading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">You have no orders yet.</p>
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
                      className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${order.Status === 'Delivered' || order.Status === 'Cancelled' || order.Status === 'Returned' ? 'opacity-40 cursor-not-allowed filter' : ''}`}
                      onClick={() => handleCancelClick(order._id, order.ProductId)}
                      disabled={order.Status === 'Delivered' || order.Status === 'Cancelled' || order.Status === 'Returned'}
                    >
                      Cancel Order
                    </button>
                    <button
                      className={`bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition ${order.Status !== 'Delivered' || order.Status === 'Returned' ? 'opacity-40 cursor-not-allowed filter' : ''}`}
                      onClick={() => handleReturnClick(order._id, order.ProductId)}
                      disabled={order.Status !== 'Delivered' || order.Status === 'Returned'}
                    >
                      Return Order
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
      {isFetching && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={closeModal} />}
      <CancelConfirmationModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={orderToCancel.orderId}
        productId={orderToCancel.productId}
      />
      <ReturnConfirmationModal
        show={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleConfirmReturn}
        orderId={orderToReturn.orderId}
        productId={orderToReturn.productId}
      />
    </div>
  );
};

export default OrdersList;




