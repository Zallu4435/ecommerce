import { useState } from "react";
import { card, razorpay } from "../../../assets/images/index";

const PaymentMethod = ({ onPaymentMethodChange }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("");

  const paymentMethods = [
    { label: "Pay Online", value: "online" },
    { label: "Cash on Delivery", value: "cod" },
  ];

  const onlineMethods = [
    {
      label: "Razorpay",
      value: "razorpay",
      img: razorpay,
    },
    {
      label: "wallet",
      value: "card",
      img: card,
    },
  ];

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setPaymentMethod(value);
    setOnlinePaymentMethod("");
    onPaymentMethodChange?.({
      paymentMethod: value,
      onlinePaymentMethod: "",
    });
  };

  const handleOnlinePaymentMethodChange = (method) => {
    setOnlinePaymentMethod(method);
    onPaymentMethodChange?.({
      paymentMethod: "online",
      onlinePaymentMethod: method,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 sm:p-5 md:p-6 shadow-md rounded-md w-full sm:w-[400px] md:w-[440px] mx-auto">
      <h2 className="text-lg sm:text-xl dark:text-gray-200 text-gray-700 font-semibold mb-3 sm:mb-4">
        Payment Method
      </h2>
      
      <div className="space-y-2 sm:space-y-3">
        {paymentMethods.map((method) => (
          <div 
            className="flex items-center" 
            key={method.value}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={handlePaymentMethodChange}
              className="mr-2 h-4 w-4"
            />
            <label className="text-sm sm:text-base font-medium">
              {method.label}
            </label>
          </div>
        ))}
      </div>

      {paymentMethod === "online" && (
        <div className="mt-4 sm:mt-5">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
            Select Online Payment Option
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {onlineMethods.map((method) => (
              <div
                key={method.value}
                onClick={() => handleOnlinePaymentMethodChange(method.value)}
                className={`cursor-pointer border p-3 sm:p-4 rounded-md flex flex-col items-center ${
                  onlinePaymentMethod === method.value
                    ? "border-indigo-500"
                    : "border-gray-300"
                } hover:shadow-md transition-shadow duration-200`}
              >
                <img
                  src={method.img}
                  alt={method.label}
                  className="mb-2 w-16 sm:w-20 h-10 sm:h-12 object-cover"
                />
                <span className="text-xs sm:text-sm font-medium text-center">
                  {method.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;