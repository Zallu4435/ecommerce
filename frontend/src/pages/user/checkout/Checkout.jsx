import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import ShippingAddress from "../forms/ShippingAddress";
import OrderDetails from "./OrderDetails";
import PaymentMethod from "./PaymentMethod";
import ApplyCoupen from "./ApplyCoupen";
import { CreditCard, Tag, PackageCheck } from "lucide-react";

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

    if (payment.paymentMethod === 'cod' && order?.total > 2500) {
      toast.info('COD is not available for order greater than 2500')
      return;
    }

    navigate("/proceed-to-payment", {
      state: { address, order, payment, coupon },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Complete your purchase by providing delivery and payment details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery & Items */}
          <div className="lg:col-span-7 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <PackageCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery & Items</h2>
              </div>
              <div className="space-y-8">
                <ShippingAddress onAddressSelect={handleAddressSelect} />
                <OrderDetails onOrderChange={handleOrderChange} address={address} coupon={coupon} />
              </div>
            </section>
          </div>

          {/* Right Column: Summary & Payment Wrapper */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 shadow-sm space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Offers & Discounts</h2>
                  </div>
                  <ApplyCoupen onCouponApply={handleCouponApply} orderTotal={order?.total} />
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                  </div>
                  <PaymentMethod onPaymentMethodChange={handlePaymentMethodChange} />
                </section>

                <div className="pt-4">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                  >
                    Proceed to Payment
                  </button>
                  <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6 uppercase tracking-widest font-bold">
                    Encrypted & Secure Transaction
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 px-10 leading-relaxed">
                By proceeding, you agree to our <span className="text-blue-500 font-medium cursor-pointer">Terms of Service</span> and <span className="text-blue-500 font-medium cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
