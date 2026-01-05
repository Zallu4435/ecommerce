import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import ShippingAddress from "../forms/ShippingAddress";
import OrderDetails from "./OrderDetails";
import PaymentMethod from "./PaymentMethod";
import ApplyCoupen from "./ApplyCoupen";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState({
    paymentMethod: "",
    onlinePaymentMethod: "",
  });
  const [coupon, setCoupon] = useState(null);

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
  };

  const handleOrderChange = (orderData) => {
    setOrder(orderData);
  };

  const handlePaymentMethodChange = (paymentData) => {
    setPayment(paymentData);
  };

  const handleCouponApply = (appliedCoupon) => {
    setCoupon(appliedCoupon);
  };

  const handleProceedToPayment = () => {
    if (!address) {
      toast.info("Please select a shipping address.");
      return;
    }
    if (!order) {
      toast.info("Please add items to your order.");
      return;
    }

    if (!payment.paymentMethod) {
      toast.info("Please select a payment method.");
      return;
    }

    if (payment.paymentMethod == 'cod' && order?.total > 2500) {
      toast.info('COD is not available for order greater than 2500')
      return;
    }

    navigate("/proceed-to-payment", {
      state: { address, order, payment, coupon },
    });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 py-10 px-4 gap-x-12">
      <div className="grid gap-10">
        <ShippingAddress onAddressSelect={handleAddressSelect} />
        <OrderDetails onOrderChange={handleOrderChange} address={address} coupon={coupon} />
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 justify-center grid space-y-3 rounded-lg shadow-md h-fit w-full lg:w-[550px] mx-auto">
        <PaymentMethod onPaymentMethodChange={handlePaymentMethodChange} />
        <ApplyCoupen onCouponApply={handleCouponApply} orderTotal={order?.total} />

        <button
          onClick={handleProceedToPayment}
          className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
