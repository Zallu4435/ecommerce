import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi"; // Importing an icon for the back button
import { useGetOrdersQuery, useProcessPaymentMutation } from "../../redux/apiSliceFeatures/addressPasswordApiSlice";

const ProceedToPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, order, payment, coupon, productId } = location.state || {};
    const { refetch: refetchOrder } = useGetOrdersQuery();
  

  const [processPayment] = useProcessPaymentMutation();

  console.log(order.productId , "order from he proceed to [payment")
  if (!address || !order || !payment) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-600">
        Missing required information. Please return to the checkout page.
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    try {
      // Prepare the data to send to the backend
      const payload = {
        address,
        order,
        payment,
        // productId: productId || null,
        couponCode: coupon?.code || null, // Include coupon code if present
      };
  
      // Make the API call to process the payment
      const response = await processPayment(payload);
      console.log(response, )
      if (response?.data?.message === "Order placed successfully") {
        refetchOrder();
        // console.log('Payment successful:', response);
        navigate("/payment-success");
      }
    } catch (error) {
      console.error("An error occurred:", error.response?.data || error.message);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-300">Proceed to Payment</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
          >
            <HiOutlineArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Address Section */}
        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shipping Address</h3>
          <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-1">
            <p>{address.line1}</p>
            <p>{address.city}, {address.state}, {address.zip}</p>
            <p>{address.country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order Summary</h3>
          <div className="mt-2 space-y-2">
            {order.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-700 dark:text-gray-300">{item.productName}</span>
                <span className="text-gray-700 dark:text-gray-300">{item.quantity} x ₹{item.originalPrice.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-semibold mt-2 text-gray-900 dark:text-gray-100">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Method</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {payment.paymentMethod === "online"
              ? `Online Payment (${payment.onlinePaymentMethod})`
              : "Cash on Delivery"}
          </p>
        </div>

        {/* Coupon Section */}
        {coupon && (
          <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Applied Coupon</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{coupon}</p>
          </div>
        )}

        {/* Confirm Payment Button */}
        <button
          onClick={handleConfirmPayment}
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 mt-6"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default ProceedToPaymentPage;
