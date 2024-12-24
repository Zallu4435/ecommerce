import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';

const OrdersList = () => {
  const navigate = useNavigate();

  // Fetch orders using RTK Query
  const { data: orders = [], error, isLoading } = useGetOrdersQuery();

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Your Orders</h2>
      <ul className="divide-y divide-gray-300 dark:divide-gray-600">
        {orders.map((order) => (
          <li
            key={order._id} // Use order._id to uniquely identify the order
            className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center">
              <img
                src={order.Items.ProductImage} // Access ProductImage directly from the Items object
                alt={order.Items.ProductName}  // Access ProductName directly from the Items object
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {order.Items.ProductName}  {/* Access ProductName directly from the Items object */}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order ID: {order._id}</p>
                <p
                  className={`text-sm font-semibold ${
                    order.Status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {order.Status}
                </p>
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => navigate(`/track-order/${order._id}`, { state: { order } })}
            >
              Track Order
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersList;
