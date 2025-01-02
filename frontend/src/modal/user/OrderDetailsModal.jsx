import React, { useEffect } from 'react';
import { useGetAddressByOrderIdQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';
import { FaTimes } from 'react-icons/fa'; // Importing close icon

const OrderDetailsModal = ({ order, onClose }) => {
  console.log(order, "order");

  // Fetch address details using the order ID when the modal opens
  const { data: address, error, isLoading } = useGetAddressByOrderIdQuery(order._id, {
    skip: !order._id, // Only make the request if order._id exists
  });

  // Fetch data only when the modal opens
  useEffect(() => {
    if (order && order._id) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto'; // Restore scroll
      };
    }
  }, [order]);

  if (isLoading) return <p className="text-center text-gray-500 dark:text-gray-400">Loading address...</p>;
  if (error) return <p className="text-center text-red-500 dark:text-red-400">Error fetching address details: {error.message}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-orange-50 dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition">
          <FaTimes className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Order Details
        </h2>

        {/* Order Info */}
        <div className="mb-6 p-4 rounded-lg shadow-lg border-2 border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-300 dark:to-indigo-400">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-700">Order Information</h3>
          <p><strong>Status:</strong> {order.Status}</p>
          <p><strong>Total Amount:</strong> ₹{order.TotalAmount}</p>
          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Address Info */}
        {address && (
          <div className="mb-6 p-4 rounded-lg shadow-lg border-2 border-green-500 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-300 dark:to-green-400">
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-700">Shipping Address</h3>
            <p><strong>Street:</strong> {address.street}</p>
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>State:</strong> {address.state}</p>
            <p><strong>Zip Code:</strong> {address.zipCode}</p>
            <p><strong>Country:</strong> {address.country}</p>
          </div>
        )}

        {/* Product Info */}
        <div className="mb-6 p-4 rounded-lg shadow-lg border-2 border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-300 dark:to-purple-400">
          <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-700">Product Information</h3>
          <div className="flex items-center space-x-4">
            <img
              src={order.ProductImage}
              alt={order.ProductName}
              className="w-16 h-16 object-cover rounded-lg shadow-lg"
            />
            <div>
              <p><strong>Product Name:</strong> {order.ProductName}</p>
              <p><strong>Quantity:</strong> {order.Quantity}</p>
              <p><strong>Price per unit:</strong> ₹ {order.offerPrice}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-400 dark:bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
