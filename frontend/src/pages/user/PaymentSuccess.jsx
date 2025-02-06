import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center my-14 lg:min-h-screen lg:my-0 bg-gray-100 dark:bg-gray-900 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 md:p-10 w-full max-w-md text-center">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-5 md:mb-6" />
          
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-3 sm:mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
            Your payment has been processed successfully. You will receive a
            confirmation email shortly.
          </p>
          
          <div className="space-y-3 sm:space-y-4 w-full">
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg 
                     text-sm sm:text-base transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              onClick={() => navigate("/")}
            >
              Go to Homepage
            </button>
            
            <button
              className="w-full bg-red-300 border border-green-500 text-white font-bold hover:bg-red-400 
                     py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base transition duration-300 ease-in-out 
                     transform hover:-translate-y-1 hover:scale-105"
              onClick={() => navigate("/profile/order")}
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