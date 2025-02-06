import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProcessPaymentMutation } from "../../redux/apiSliceFeatures/userProfileApi";
import { ArrowLeft } from "lucide-react";

const ProceedToPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, order, payment, coupon } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [processPayment, { isLoading: isPaymentProcessing }] =
    useProcessPaymentMutation();

  if (!address || !order || !payment) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-600">
        Missing required information. Please return to the checkout page.
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const simulateCardPayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccessful = Math.random() < 0.9;
        resolve(isSuccessful);
      }, 2000);
    });
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      const razorpayAmount = Math.round(
        (coupon ? discountedPrice : order.total) * 100
      );

      if (payment.paymentMethod === "online") {
        if (payment.onlinePaymentMethod === "razorpay") {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            toast.error("Razorpay SDK failed to load. Please try again later.");
            setLoading(false);
            return;
          }

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: razorpayAmount,
            currency: "INR",
            name: "Test Business",
            description: "Test Transaction",
            image: "https://example.com/logo.png",
            handler: async function (response) {
              toast.success("Payment successful!");

              try {
                const paymentData = {
                  address,
                  order,
                  couponCode: coupon ? coupon.couponCode : null,
                  payment: {
                    paymentMethod: "razorpay",
                    onlinePaymentMethod: "razorpay",
                  },
                  productId: null,
                  quantity: null,
                };

                const data = await processPayment(paymentData).unwrap();

                navigate("/payment-success", {
                  state: { paymentId: data.paymentId, orderId: data.orderId },
                });
              } catch (error) {
                console.error("Error processing payment:", error);
                toast.error(
                  "Failed to process the order or payment. Please try again."
                );
              }
            },
            prefill: {
              name: "John Doe",
              email: "john.doe@example.com",
              contact: "9876543210",
            },
            notes: {
              address: "Dummy Address for Testing",
            },
            theme: {
              color: "#3399cc",
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        } else if (payment.onlinePaymentMethod === "card") {
          toast.info("Processing card payment...");
          const isSuccessful = await simulateCardPayment();
          if (isSuccessful) {
            const paymentData = {
              address,
              order,
              couponCode: coupon ? coupon.couponCode : null,
              payment: {
                paymentMethod: "card",
                onlinePaymentMethod: "card",
              },
              productId: null,
              quantity: null,
            };

            const data = await processPayment(paymentData).unwrap();
            navigate("/payment-success", {
              state: { paymentId: data.paymentId, orderId: data.orderId },
            });
          } else {
            toast.error("Card payment failed. Please try again.");
          }
        } else {
          toast.error("Unsupported online payment method.");
        }
      } else if (payment.paymentMethod === "cod") {
        toast.info("Cash on Delivery selected. Confirming order...");
        setTimeout(async () => {
          try {
            const paymentData = {
              address,
              order,
              couponCode: coupon ? coupon.couponCode : null,
              payment: {
                paymentMethod: "cod",
                onlinePaymentMethod: null,
              },
              productId: null,
              quantity: null,
            };

            const data = await processPayment(paymentData).unwrap();

            navigate("/payment-success", {
              state: { paymentId: data.paymentId, orderId: data.orderId },
            });
          } catch (error) {
            console.error("Error processing payment:", error);
            toast.error(
              error?.data?.message ||
                "Failed to process the order or payment. Please try again."
            );
          }
        }, 1500);
      } else {
        toast.error("Invalid payment method selected.");
      }
    } catch (error) {
      console.error("An error occurred:", error?.message || error);
      toast.error(
        error?.data?.message,
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const discountedPrice = coupon
    ? order.total - order.total * (coupon.discount / 100)
    : order.total;
  const discountAmount = coupon ? order.total * (coupon.discount / 100) : 0;

  if (!address || !order || !payment) {
    return (
      <div className="text-center mt-10 sm:mt-20 px-4 text-base sm:text-xl font-semibold text-red-600">
        Missing required information. Please return to the checkout page.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300">
            Proceed to Payment
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to Checkout</span>
          </button>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Shipping Address
          </h3>
          <div className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-1">
            <p className="break-words">{address.line1}</p>
            <p>
              {address.city}, {address.state}, {address.zip}
            </p>
            <p>{address.country}</p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Order Summary
          </h3>
          <div className="mt-2 space-y-2">
            {order.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-600"
              >
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words mb-1 sm:mb-0">
                  {item.productName}
                </span>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.quantity} x ₹{item.offerPrice?.toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex justify-between py-2 mt-2 sm:mt-4">
              <span className="text-sm sm:text-base font-semibold">
                Total (Inc. Tax & Shipping)
              </span>
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                ₹ {order?.total ? order?.total : order?.total?.toFixed(2)}
              </span>
            </div>

            {typeof discountAmount === "number" && !isNaN(discountAmount) && (
              <div className="flex justify-between py-2">
                <span className="text-sm sm:text-base font-semibold">
                  Discount
                </span>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  ₹ {discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2">
              <span className="text-sm sm:text-base font-semibold">
                Total after Discount
              </span>
              <span className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100 whitespace-nowrap">
                ₹
                {typeof discountedPrice === "number" && !isNaN(discountedPrice)
                  ? discountedPrice.toFixed(2)
                  : discountedPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Payment Method
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                checked={payment.paymentMethod === "cod"}
                onChange={() => {}}
                className="mr-3 h-4 w-4"
              />
              <label
                htmlFor="cod"
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
              >
                Cash on Delivery
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                checked={payment.paymentMethod === "online"}
                onChange={() => {}}
                className="mr-3 h-4 w-4"
              />
              <label
                htmlFor="online"
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
              >
                Online Payment
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirmPayment}
            className="w-full sm:w-auto bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base"
            disabled={isPaymentProcessing || loading}
          >
            {isPaymentProcessing || loading
              ? "Processing..."
              : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProceedToPaymentPage;
