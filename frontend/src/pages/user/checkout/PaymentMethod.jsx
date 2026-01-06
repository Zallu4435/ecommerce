import { useState } from "react";
import { card, razorpay } from "../../../assets/images/index";
import { CheckCircle2, Wallet, Banknote, CreditCard } from "lucide-react";

const PaymentMethod = ({ onPaymentMethodChange }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("");

  const paymentMethods = [
    { label: "Pay Online", value: "online", icon: <CreditCard className="w-5 h-5" />, description: "Cards, Net Banking, Wallet" },
    { label: "Cash on Delivery", value: "cod", icon: <Banknote className="w-5 h-5" />, description: "Pay when you receive" },
  ];

  const onlineMethods = [
    {
      label: "Razorpay",
      value: "razorpay",
      img: razorpay,
    },
    {
      label: "Wallet",
      value: "card",
      img: card,
    },
  ];

  const handlePaymentMethodChange = (value) => {
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
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm transition-all duration-300">
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.value}
            onClick={() => handlePaymentMethodChange(method.value)}
            className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === method.value
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                : "border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20"
              }`}
          >
            <div className={`p-3 rounded-xl ${paymentMethod === method.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}>
              {method.icon}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-bold ${paymentMethod === method.value ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                  {method.label}
                </span>
                {paymentMethod === method.value && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
            </div>
          </div>
        ))}
      </div>

      {paymentMethod === "online" && (
        <div className="mt-8 animate-fadeIn">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">
            Select Service Provider
          </p>
          <div className="grid grid-cols-2 gap-4">
            {onlineMethods.map((method) => (
              <div
                key={method.value}
                onClick={() => handleOnlinePaymentMethodChange(method.value)}
                className={`relative group cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 ${onlinePaymentMethod === method.value
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-gray-50 dark:border-gray-800 hover:border-blue-100 dark:hover:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20"
                  }`}
              >
                <div className="w-full h-12 flex items-center justify-center">
                  <img
                    src={method.img}
                    alt={method.label}
                    className="max-h-full max-w-full object-contain filter dark:brightness-110 grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <span className={`text-xs font-bold ${onlinePaymentMethod === method.value ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {method.label}
                </span>
                {onlinePaymentMethod === method.value && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-0.5 shadow-lg border-2 border-white dark:border-gray-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;