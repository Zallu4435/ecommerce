import { useNavigate } from "react-router-dom";
import ShippingAddress from "../forms/ShippingAddress";
import OrderDetails from "./OrderDetails";
import PaymentMethod from "./PaymentMethod";
import ApplyCoupen from "./ApplyCoupen";

const CheckoutPage = () => {

  const navigate = useNavigate();

  return (
    <div className="container mx-auto grid grid-cols-1 space-x-52 lg:grid-cols-2 py-10 px-4">
      <div className="grid gap-10">
        <ShippingAddress />

        <OrderDetails />
      </div>

      <div className="grid h-[600px] py-10 w-[550px] justify-center border-2 gap-y-10">
        
        <PaymentMethod />

        <ApplyCoupen />

        {/* Proceed Button */}
        <button
          onClick={() => navigate('/payment-success')}
          className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;