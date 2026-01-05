import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const OrderDetails = ({ onOrderChange, coupon }) => {
  const location = useLocation();
  const { cartItems, productId, total: cartTotal } = location.state || {};
  const prevOrderRef = useRef(null);

  const discountAmount = coupon?.potentialDiscount || 0;
  const finalTotal = (cartTotal || 0) - discountAmount;

  useEffect(() => {
    const currentOrder = { cartItems, total: finalTotal, subtotal: cartTotal, productId, discount: discountAmount, couponCode: coupon?.code };
    // Only trigger update if meaningful data changed to avoid loops, though ref check helps
    if (
      onOrderChange &&
      cartItems &&
      JSON.stringify(prevOrderRef.current) !== JSON.stringify(currentOrder)
    ) {
      prevOrderRef.current = currentOrder;
      onOrderChange(currentOrder);
    }
  }, [onOrderChange, cartItems, cartTotal, productId, discountAmount, coupon, finalTotal]);

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
                {product.quantity} x ₹ {(product.offerPrice || product.originalPrice)?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal:</span>
            <span>₹ {cartTotal}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Coupon Discount:</span>
              <span>- ₹ {discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
            <span>Total:</span>
            <span>₹ {finalTotal}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
