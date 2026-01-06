import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag, Star, ShieldCheck } from "lucide-react";

const OrderDetails = ({ onOrderChange, coupon }) => {
  const location = useLocation();
  const { cartItems, productId, total: cartTotal } = location.state || {};
  const prevOrderRef = useRef(null);

  const discountAmount = coupon?.potentialDiscount || 0;
  const finalTotal = (cartTotal || 0) - discountAmount;

  useEffect(() => {
    const currentOrder = { cartItems, total: finalTotal, subtotal: cartTotal, productId, discount: discountAmount, couponCode: coupon?.code };
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
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800">
        <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-800 mb-4" />
        <h3 className="text-xl font-bold text-gray-500">No items in cart</h3>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Your Order</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {cartItems.map((product) => (
            <div
              key={product.id}
              className="flex gap-5 items-center group animate-fadeIn"
            >
              <div className="relative w-20 h-20 shrink-0">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-full object-cover rounded-2xl border border-gray-50 dark:border-gray-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-900 shadow-lg">
                  x{product.quantity}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-base truncate mb-1">
                  {product.productName}
                </h4>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {[product.color, product.size, product.gender === "Male" ? "Boy" : product.gender === "Female" ? "Girl" : product.gender].filter(Boolean).join(" • ")}
                </p>
                <div className="mt-2 text-sm font-black text-blue-600 dark:text-blue-400">
                  ₹ {Number(product.offerPrice || product.originalPrice)?.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">Order Subtotal</span>
            <span className="text-gray-900 dark:text-white font-bold">₹ {Number(cartTotal || 0).toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm font-medium text-emerald-600">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                <span>Coupon Savings</span>
              </div>
              <span className="font-bold">- ₹ {Number(discountAmount || 0).toFixed(2)}</span>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">Grand Total</span>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Checkout
                </div>
              </div>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                ₹ {Number(finalTotal || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
