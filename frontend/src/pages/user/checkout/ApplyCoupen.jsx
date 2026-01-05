import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetCheckoutCouponsQuery } from "../../../redux/apiSliceFeatures/userProfileApi";
import { useValidateCouponMutation } from "../../../redux/apiSliceFeatures/CouponApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";

const ApplyCoupon = ({ onCouponApply, orderTotal }) => {
  const location = useLocation();
  const { productId } = location.state || {}; // Still keep this for product specific suggestions
  const { currentUser } = useSelector((state) => state.user);

  const {
    data: availableCoupons = [],
    isLoading: isLoadingSuggestions,
  } = useGetCheckoutCouponsQuery(productId, { skip: !productId });

  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponCode;

    if (!code || typeof code !== "string" || code.trim() === "") {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    try {
      const result = await validateCoupon({
        couponCode: code,
        userId: currentUser?.id,
        purchaseAmount: orderTotal,
        // productIds: [productId] // Ideally pass all cart product IDs if available, but for now validate broadly
      }).unwrap();

      if (result.success) {
        setAppliedCoupon(result.coupon);
        setCouponCode(result.coupon.code);
        onCouponApply(result.coupon);
        toast.success(`Coupon applied! Saved ₹${result.coupon.potentialDiscount}`);
      }
    } catch (err) {
      console.error("Coupon validation failed:", err);
      toast.error(err?.data?.message || "Invalid or expired coupon");
      setAppliedCoupon(null);
      onCouponApply(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    onCouponApply(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 shadow-md rounded-md">
      <h2 className="text-xl dark:text-gray-200 text-gray-600 font-semibold mb-4">
        Apply Coupon
      </h2>

      {appliedCoupon ? (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md transition-all ease-in-out duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-800 dark:text-green-200 font-bold text-lg">
                {appliedCoupon.code}
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                You saved <span className="font-bold">₹{appliedCoupon.potentialDiscount}</span>
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Input Section */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 p-3 border dark:text-white border-gray-300 bg-white dark:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase transition-all"
              disabled={isValidating}
            />
            <button
              onClick={() => handleApplyCoupon()}
              disabled={isValidating || !couponCode}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isValidating ? "Applying..." : "Apply"}
            </button>
          </div>

          {/* Suggestions Section */}
          {isLoadingSuggestions ? (
            <LoadingSpinner size="sm" />
          ) : (
            availableCoupons.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Available Coupons:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon._id || coupon.id}
                      className="p-3 border border-dashed border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer group transition-colors"
                      onClick={() => handleApplyCoupon(coupon.couponCode)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{coupon.couponCode}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{coupon.discount}% OFF</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{coupon.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ApplyCoupon;
