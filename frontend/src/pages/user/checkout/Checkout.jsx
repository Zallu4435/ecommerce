import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShippingAddress from "../forms/ShippingAddress";
import OrderDetails from "./OrderDetails";
import PaymentMethod from "./PaymentMethod";
import ApplyCoupen from "./ApplyCoupen";

const CheckoutPage = () => {
  const navigate = useNavigate();


  // States for data collection
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState({
    paymentMethod: "",
    onlinePaymentMethod: "",
  });
  const [coupon, setCoupon] = useState(null);


  // Handlers for data updates
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    // console.log("Selected Address:", selectedAddress);
  };

  const handleOrderChange = (orderData) => {
    console.log(orderData, "ordare data ")
    setOrder(orderData);
    // console.log("Order Data:", orderData);
  };

  const handlePaymentMethodChange = (paymentData) => {
    setPayment(paymentData);
    // console.log("Payment Data:", paymentData);
  };

  const handleCouponApply = (appliedCoupon) => {
    setCoupon(appliedCoupon);
    console.log("Applied Coupon:", appliedCoupon);
  };

  const handleProceedToPayment = () => {
    
    // Validation to ensure all required fields are filled
    if (!address) {
      alert("Please select a shipping address.");
      return;
    }
    if (!order) {
      alert("Please add items to your order.");
      return;
    }
    if (!payment.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Proceed if everything is validated
    navigate("/proceed-to-payment", { state: { address, order, payment, coupon } });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 py-10 px-4 gap-x-12">
      {/* Left Section */}
      <div className="grid gap-10">
        <ShippingAddress onAddressSelect={handleAddressSelect} />
        <OrderDetails onOrderChange={handleOrderChange} address={address} />
      </div>

      {/* Right Section */}
      <div className="bg-white dark:bg-gray-900 p-6 justify-center grid space-y-3 rounded-lg shadow-md h-fit w-full lg:w-[550px] mx-auto">
        <PaymentMethod onPaymentMethodChange={handlePaymentMethodChange} />
        <ApplyCoupen onCouponApply={handleCouponApply} />

        <button
          onClick={handleProceedToPayment}
          className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300"
          disabled={!address || !order || !payment.paymentMethod} // Disable if any of the fields are incomplete
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
