import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetCheckoutCouponsQuery } from "../../../redux/apiSliceFeatures/addressPasswordApiSlice";

const ApplyCoupon = ({ onCouponApply }) => {
  const location = useLocation();
  const { productId } = location.state || {};

  const {
    data: availableCoupons = [],
    error,
    isLoading,
  } = useGetCheckoutCouponsQuery(productId);
  const [coupon, setCoupon] = useState(""); // Ensure coupon is initialized as an empty string
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleCouponSelect = (selectedCoupon) => {
    setSelectedCoupon(selectedCoupon);
    setCoupon(selectedCoupon.couponCode); // Set couponCode to the coupon input
  };

  const handleApplyCoupon = () => {
    // Ensure coupon is a string, even if state is somehow set to undefined
    if (typeof coupon !== "string" || coupon.trim() === "") {
      alert("Please enter a valid coupon code.");
      return;
    }

    const validCoupon = availableCoupons.find((c) => c.couponCode === coupon); // Match coupon code
    if (validCoupon) {
      setAppliedCoupon(validCoupon);
      onCouponApply(validCoupon); // Pass the applied coupon to the parent component
    } else {
      alert("Invalid coupon code. Please try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setSelectedCoupon(null);
    setCoupon("");
    onCouponApply(null); // Notify parent that no coupon is applied
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching coupons: {error.message}</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 shadow-md rounded-md">
      <h2 className="text-xl dark:text-gray-200 text-gray-600 font-semibold mb-4">Apply Coupon</h2>

      {appliedCoupon ? (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-700">
            Coupon applied: {appliedCoupon.couponCode} ({appliedCoupon.discount} off)
          </p>
          <button
            onClick={handleRemoveCoupon}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Remove Coupon
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Available Coupons:</h3>
            {availableCoupons.length === 0 ? (
              <p className="text-blue-500">No available coupons for this product.</p>
            ) : (
              <div className="space-y-2">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => handleCouponSelect(coupon)}
                    className={`w-full p-2 text-left border rounded-md ${
                      selectedCoupon?.id === coupon.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                  >
                    {coupon.couponCode}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className={`w-full p-3 border dark:text-gray-200 border-gray-300 bg-gray-300 dark:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              availableCoupons.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={availableCoupons.length === 0}
          />

          <button
            onClick={handleApplyCoupon}
            disabled={availableCoupons.length === 0}
            className={`w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 ${
              availableCoupons.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Apply Coupon
          </button>
        </>
      )}
    </div>
  );
};

export default ApplyCoupon;
