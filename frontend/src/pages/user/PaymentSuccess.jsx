import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Using a different tick mark icon

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-10 max-w-md text-center">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-8xl mb-6" /> 
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Your payment has been processed successfully. You will receive a 
            confirmation email shortly.
          </p>
          <div className="space-y-4">
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg 
                     transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </button>
            <button
              className="w-full bg-red-300 border border-green-500 text-white font-bold hover:bg-red-400 
                     py-3 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              onClick={() => navigate('/profile/order')}
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;