import ProductTableForCartlist from "../../components/user/ProductTable/ProductTableForCartlist";
import { useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../../redux/apiSliceFeatures/CartApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useState, useEffect } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const { data: cartItems = [], error, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const calculateSubtotal = () =>
    cartItems
      ? cartItems?.reduce(
          (acc, item) => acc + item.originalPrice * item.quantity,
          0
        )
      : 0;

  const calculateTax = (subtotal) => (subtotal * 0.08).toFixed(2);
  const shippingCost = 15.0;
  const calculateTotal = (subtotal) =>
    (
      parseFloat(subtotal) +
      parseFloat(calculateTax(subtotal)) +
      shippingCost
    ).toFixed(2);

  const subtotal = calculateSubtotal();

  useEffect(() => {
    if (
      cartItems &&
      cartItems.some((item) => item.stockQuantity <= item?.quantity)
    ) {
      setIsOutOfStock(true);
    } else {
      setIsOutOfStock(false);
    }
  }, [cartItems]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading cart data</div>;
  }

  const handleCheckout = () => {
    if (isOutOfStock) {
      return;
    }
    const total = calculateTotal(subtotal);
    navigate("/checkout", { state: { cartItems, total } });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 p-6">
        <div className="col-span-1 lg:col-span-8">
          <ProductTableForCartlist
            type="cart"
            data={cartItems}
            onRemove={handleRemove}
          />
        </div>

        <div className="p-8 bg-white h-[540px] dark:bg-gray-800 rounded-lg shadow-xl lg:mt-10 md:w-[350px] w-[300px] lg:col-span-3 mx-auto lg:mx-0 mt-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            Cart Total
          </h2>
          <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
            <span className="font-medium">Tax (8%)</span>
            <span className="font-medium">₹ {calculateTax(subtotal)}</span>
          </div>
          <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
            <span className="font-medium">Shipping</span>
            <span className="font-medium">₹ {shippingCost.toFixed(2)}</span>
          </div>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
          <div className="mb-6 flex justify-between text-gray-800 dark:text-gray-100 text-lg font-bold">
            <span>Total</span>
            <span>₹ {calculateTotal(subtotal)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isOutOfStock}
            className={`w-full py-3 ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 dark:bg-blue-700 dark:hover:bg-blue-600"
            } rounded-md mt-5`}
          >
            Proceed to Checkout
          </button>
          {isOutOfStock && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-400 text-red-800 dark:text-red-300 rounded-md shadow-md">
              <h3 className="text-lg font-bold mb-2">Attention!</h3>
              <p className="text-sm">
                Some items in your cart are <strong>out of stock</strong>.
                Please remove them to proceed with the checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
