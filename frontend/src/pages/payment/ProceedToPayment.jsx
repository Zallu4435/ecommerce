import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProcessPaymentMutation } from "../../redux/apiSliceFeatures/addressPasswordApiSlice";
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

      if (payment.paymentMethod === "online") {
        if (payment.onlinePaymentMethod === "razorpay") {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            toast.error("Razorpay SDK failed to load. Please try again later.");
            setLoading(false);
            return;
          }

          const options = {
            key: "rzp_test_1rT7BxhvJixZp1",
            amount: (coupon ? discountedPrice : order.total) * 100,
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
            toast.success("Card payment successful!");

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
              "Failed to process the order or payment. Please try again."
            );
          }
        }, 1500);
      } else {
        toast.error("Invalid payment method selected.");
      }
    } catch (error) {
      console.error("An error occurred:", error?.message || error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const discountedPrice = coupon
    ? order.total - order.total * (coupon.discount / 100)
    : order.total;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-300">
            Proceed to Payment
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Checkout</span>
          </button>
        </div>

        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Shipping Address
          </h3>
          <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-1">
            <p>{address.line1}</p>
            <p>
              {address.city}, {address.state}, {address.zip}
            </p>
            <p>{address.country}</p>
          </div>
        </div>

        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Order Summary
          </h3>
          <div className="mt-2 space-y-2">
            {order.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {item.productName}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.quantity} x ₹{item.originalPrice.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-2 mt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                ₹
                {typeof discountedPrice === "number" && !isNaN(discountedPrice)
                  ? discountedPrice.toFixed(2)
                  : discountedPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Payment Method
          </h3>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                checked={payment.paymentMethod === "cod"}
                onChange={() => {}}
                className="mr-3"
              />
              <label htmlFor="cod" className="text-gray-700 dark:text-gray-300">
                Cash on Delivery
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                checked={payment.paymentMethod === "online"}
                onChange={() => {}}
                className="mr-3"
              />
              <label
                htmlFor="online"
                className="text-gray-700 dark:text-gray-300"
              >
                Online Payment
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirmPayment}
            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300"
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
