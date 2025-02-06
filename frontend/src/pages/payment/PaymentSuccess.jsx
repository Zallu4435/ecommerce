import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; 

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center my-20">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-10 max-w-md text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="text-green-500 text-9xl mb-6">
          <FaCheckCircle />
        </div>
        <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
          Payment Successful
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Thank you! Your payment has been processed successfully. You will
          receive a confirmation email shortly.
        </p>
        <div className="space-y-4">
          <button
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 transform hover:-translate-y-1 hover:scale-105"
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
          <button
            className="w-full bg-white border border-green-500 text-green-500 py-3 rounded-lg hover:bg-green-50 transition duration-300 transform hover:-translate-y-1 hover:scale-105"
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
