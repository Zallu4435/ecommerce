// PaymentSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center my-20">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        {/* Success Icon */}
        <div className="text-green-500 text-6xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful</h2>
        {/* Message */}
        <p className="text-gray-700 mb-6">
          Thank you! Your payment has been processed successfully. You will
          receive a confirmation email shortly.
        </p>
        {/* Buttons */}
        <div className="space-y-3">
          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
          <button
            className="w-full bg-white border border-green-500 text-green-500 py-2 rounded-lg hover:bg-green-50 transition"
            onClick={() => navigate('/profile/order')}
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
