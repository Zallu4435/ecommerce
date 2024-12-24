import { useState } from "react";

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
      img: "https://via.placeholder.com/50?text=Razorpay",
    },
    {
      label: "Credit/Debit Card",
      value: "card",
      img: "https://via.placeholder.com/50?text=Card",
    },
  ];

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setPaymentMethod(value);
    setOnlinePaymentMethod(""); // Reset online payment method when switching
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
    <div className="bg-white p-6 shadow-md rounded-md w-[440px]">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      {paymentMethods.map((method) => (
        <div className="flex items-center mb-2" key={method.value}>
          <input
            type="radio"
            name="paymentMethod"
            value={method.value}
            checked={paymentMethod === method.value}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          <label className="font-medium">{method.label}</label>
        </div>
      ))}
      {paymentMethod === "online" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Select Online Payment Option
          </h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {onlineMethods.map((method) => (
              <div
                key={method.value}
                onClick={() => handleOnlinePaymentMethodChange(method.value)}
                className={`cursor-pointer border p-4 rounded-md flex flex-col items-center ${
                  onlinePaymentMethod === method.value
                    ? "border-indigo-500"
                    : "border-gray-300"
                } hover:shadow-md`}
              >
                <img
                  src={method.img}
                  alt={method.label}
                  className="mb-2 w-12 h-12 object-cover"
                />
                <span className="text-sm font-medium">{method.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
