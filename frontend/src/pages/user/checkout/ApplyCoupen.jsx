import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetCheckoutCouponsQuery } from "../../../redux/apiSliceFeatures/userProfileApi";
import { useValidateCouponMutation } from "../../../redux/apiSliceFeatures/CouponApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { Tag, Sparkles, X, Ticket, ChevronRight } from "lucide-react";

const ApplyCoupon = ({ onCouponApply, orderTotal }) => {
  const location = useLocation();
  const { productId } = location.state || {};
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
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm transition-all duration-300">
      {appliedCoupon ? (
        <div className="relative overflow-hidden bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-500 rounded-2xl p-5 animate-fadeIn">
          <div className="absolute top-0 right-0 p-2">
            <button
              onClick={handleRemoveCoupon}
              className="p-1.5 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Coupon Applied</p>
              <h3 className="text-xl font-black text-emerald-900 dark:text-white uppercase">{appliedCoupon.code}</h3>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                You just saved <span className="font-bold">₹{appliedCoupon.potentialDiscount.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Input Section */}
          <div className="relative">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Voucher or Coupon Code"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl text-gray-900 dark:text-white transition-all duration-300 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 uppercase font-bold tracking-wider shadow-sm"
              disabled={isValidating}
            />
            <button
              onClick={() => handleApplyCoupon()}
              disabled={isValidating || !couponCode}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold"
            >
              {isValidating ? "..." : "Apply"}
            </button>
          </div>

          {/* Suggestions Section */}
          {!isLoadingSuggestions && availableCoupons.length > 0 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recommended Offers</span>
                <Ticket className="w-4 h-4 text-gray-300" />
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon._id || coupon.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 dark:hover:border-gray-700 cursor-pointer group transition-all duration-300"
                    onClick={() => handleApplyCoupon(coupon.couponCode)}
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
                        {coupon.couponCode}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[150px]">
                        Save up to {coupon.discount}% on this order
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg uppercase tracking-wider">
                        Quick Apply
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoadingSuggestions && (
            <div className="flex justify-center p-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplyCoupon;
