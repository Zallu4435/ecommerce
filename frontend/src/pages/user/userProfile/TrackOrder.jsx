import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaTruck, FaBox, FaCheckCircle, FaClipboardList, FaShippingFast } from 'react-icons/fa'; // Importing icons

const TrackOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state || {}; // Fallback to empty object if state is undefined
  const { id } = useParams();

  if (!order) {
    return <div className="text-center mt-20 text-xl font-semibold">Order not found!</div>;
  }

  const trackingSteps = [
    { label: 'Order Placed', icon: <FaClipboardList /> },
    { label: 'Processing', icon: <FaBox /> },
    { label: 'Shipped', icon: <FaTruck /> },
    { label: 'Out for Delivery', icon: <FaShippingFast /> },
    { label: 'Delivered', icon: <FaCheckCircle /> },
  ];

  // Find the current step of the order
  const currentStep = trackingSteps.findIndex((step) => step.label === order.Status);

  const calculateLineProgress = () => {
    // Handle cases where currentStep is undefined (no matching status)
    if (currentStep === -1) return 0;

    return (currentStep / (trackingSteps.length - 1)) * 100;
  };

  const getStatusColor = () => {
    switch (order.Status) {
      case 'Order Placed':
        return 'bg-green-500'; // Set initial color to green
      case 'Processing':
        return 'bg-blue-400';
      case 'Shipped':
        return 'bg-green-400';
      case 'Out for Delivery':
        return 'bg-orange-400';
      case 'Delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Track Order</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {/* Tracking Steps */}
      <div className="relative pt-1 mb-8">
        <div className="flex justify-between items-center w-full mb-4">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 flex items-center z-30 justify-center rounded-full mb-1 ${
                  index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                }`}
              >
                {step.icon}
              </div>
              <div
                className={`text-sm font-semibold ${
                  index <= currentStep ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Line between steps */}
        <div className="absolute w-full top-6">
          <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 relative">
            <div
              className={`absolute top-0 left-0 h-full ${getStatusColor()} transition-all duration-500 ease-in-out`}
              style={{ width: `${calculateLineProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-gray-700 dark:text-gray-300">
          <strong>Order ID:</strong> {order._id || 'N/A'}
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          <strong>Delivery Date:</strong> {order.deliveryDate || 'N/A'}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={order.Items.ProductImage}
          alt={order.Items.ProductName}
          className="w-32 h-32 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Product Name:</strong> {order.Items.ProductName}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Quantity:</strong> {order.Items.Quantity}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Price:</strong> ₹ {order.Items.Price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;