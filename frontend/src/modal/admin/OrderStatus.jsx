import React, { useState, useEffect } from 'react';
import { useFetchUserOrdersQuery, useUpdateOrdersMutation } from '../../redux/apiSliceFeatures/OrderApiSlice';
import { FaClipboardList, FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa'; // Import icons for tracking steps

const OrdersModal = ({ isOpen, onClose, userId }) => {
  // Skip fetching if `userId` is missing or modal isn't open
  const { data, isLoading, isError, refetch } = useFetchUserOrdersQuery(userId, {
    skip: !isOpen || !userId,
  });

  const orders = data?.orders || []; // Extract the `orders` array from the API response
  const [updateOrders] = useUpdateOrdersMutation();
  const [updatedOrderIds, setUpdatedOrderIds] = useState([]);

  const trackingSteps = [
    { label: 'Order Placed', value: 'Order Placed', icon: <FaClipboardList /> },
    { label: 'Processing', value: 'Processing', icon: <FaBox /> },
    { label: 'Shipped', value: 'Shipped', icon: <FaTruck /> },
    { label: 'Out for Delivery', value: 'Out for Delivery', icon: <FaShippingFast /> },
    { label: 'Delivered', value: 'Delivered', icon: <FaCheckCircle /> },
  ];

  useEffect(() => {
    console.log("Modal State:", isOpen, "User ID:", userId, "Orders:", orders);
  }, [isOpen, userId, orders]);

  const handleChangeStatus = (orderId, newStatus) => {
    setUpdatedOrderIds((prevIds) =>
      prevIds.filter((item) => item.orderId !== orderId).concat([{ orderId, status: newStatus }])
    );
  };

  const handleSave = async () => {
    try {
      await updateOrders(updatedOrderIds).unwrap();
      onClose();
      setUpdatedOrderIds([]);
      refetch();
    } catch (error) {
      console.error("Error updating orders:", error);
      alert("Failed to update orders.");
    }
  };

  if (!isOpen) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load orders.</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Update Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="w-full border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600 dark:text-gray-300">Order ID</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600 dark:text-gray-300">Current Status</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600 dark:text-gray-300">Update Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.Status || 'Pending'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={
                        updatedOrderIds.find((u) => u.orderId === order._id)?.status ||
                        order.Status ||
                        'Pending'
                      }
                      onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                      className="block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                    >
                      {trackingSteps.map((step) => (
                        <option key={step.value} value={step.value}>
                          {step.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
