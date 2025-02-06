import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const OrderDetails = ({ onOrderChange }) => {
  const location = useLocation();
  const { cartItems, productId, total } = location.state || {};
  const prevOrderRef = useRef(null);

  useEffect(() => {
    const currentOrder = { cartItems, total, productId };
    if (
      onOrderChange &&
      cartItems &&
      JSON.stringify(prevOrderRef.current) !== JSON.stringify(currentOrder)
    ) {
      prevOrderRef.current = currentOrder;
      onOrderChange(currentOrder);
    }
  }, [onOrderChange, cartItems, total, productId]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        No items to display!
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-6 shadow-md rounded-md">
        <h2 className="text-xl dark:text-gray-200 text-gray-700 font-semibold mb-4">
          Order Items
        </h2>
        {cartItems.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center border-b border-gray-200 py-2"
          >
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-grow ml-4">
              <span className="font-medium">{product.productName}</span>
            </div>
            <div>
              <span>
                {product.quantity} x ₹ {product.offerPrice?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">₹ {total}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
