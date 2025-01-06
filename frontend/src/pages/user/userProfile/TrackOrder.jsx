import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaTruck, FaBox, FaCheckCircle, FaClipboardList, FaShippingFast, FaTimesCircle } from 'react-icons/fa'; // Importing icons
import { ArrowLeft } from 'lucide-react';

const TrackOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state || {}; // Fallback to empty object if state is undefined

  if (!order) {
    return <div className="text-center mt-20 text-xl font-semibold">Order not found!</div>;
  }

  const trackingSteps = [
    { label: 'Order Placed', icon: <FaClipboardList /> },
    { label: 'Processing', icon: <FaBox /> },
    { label: 'Shipped', icon: <FaTruck /> },
    { label: 'Out for Delivery', icon: <FaShippingFast /> },
    { label: 'Delivered', icon: <FaCheckCircle /> },
    { label: 'Cancelled', icon: <FaTimesCircle />, cancel: true } // New Cancelled step
  ];

  // Find the current step of the order
  const currentStep = trackingSteps.findIndex((step) => step.label === order.Status);

  const calculateLineProgress = () => {
    if (currentStep === -1) return 0;
    return (currentStep / (trackingSteps.length - 1)) * 100;
  };

  const getStatusColor = () => {
    switch (order.Status) {
      case 'Order Placed':
        return 'bg-green-500';
      case 'Processing':
        return 'bg-blue-400';
      case 'Shipped':
        return 'bg-green-400';
      case 'Out for Delivery':
        return 'bg-orange-400';
      case 'Delivered':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  // Calculate total price and quantity for all items in the order
  const totalQuantity = order.Quantity;
  const totalPrice = order.TotalAmount;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white my-10 dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-200">Track Order</h2>
        <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Products</span>
          </button>
      </div>

      {/* Tracking Steps */}
      <div className="relative pt-1 mb-8">
        <div className="flex justify-between items-center w-full mb-4">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex z-20 flex-col items-center text-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full mb-1 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'} ${step.cancel ? 'bg-red-500' : ''}`}
              >
                {step.icon}
              </div>
              <div
                className={`text-sm font-semibold ${index <= currentStep ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'} ${step.cancel ? 'text-red-500' : ''}`}
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
      <div className="grid items-center justify-center gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md">
          <img
            src={order.ProductImage}
            alt={order.ProductName}
            className="w-32 h-32 object-cover rounded-lg mb-4 mx-auto"
          />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">{order.ProductName}</p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Quantity:</strong> {order.Quantity}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Price:</strong> ₹ {order.offerPrice}
          </p>
        </div>
      </div>

      {/* Total Price and Quantity */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md mb-8">
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          <strong>Total Quantity:</strong> {totalQuantity}
        </div>
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          <strong>Total Price:</strong> ₹ {totalPrice}
        </div>
      </div>

      {/* Show Cancellation Status */}
      {order.Status === 'Cancelled' && (
        <div className="text-center mt-6 text-xl text-red-500 font-semibold">
          <strong>Order has been Cancelled</strong>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;