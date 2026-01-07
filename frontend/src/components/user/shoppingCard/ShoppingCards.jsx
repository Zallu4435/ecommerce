import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useAddToComparisonMutation,
} from "../../../redux/apiSliceFeatures/unifiedApiSlice";
import { icons } from "./icons";
import { useSelector } from "react-redux";
import { handleAddToCart } from "./ActionHandlers";
import { toast } from "react-toastify";

const ShoppingCard = ({
  _id,
  productName,
  originalPrice,
  image,
  averageRating,
  totalReviews,
  offerPrice,
  stockQuantity,
  totalStock,
  TotalStock,
  category,
  cartData = [],
  wishlistData = [],
  comparisonData = [],
  // Variant information
  availableColors,
  availableSizes,
  availableGenders,
  hasVariants,
  // Offer information
  offerInfo,
}) => {
  // Determine the actual stock value from standardizing different potential prop names
  const effectiveStock = stockQuantity ?? totalStock ?? TotalStock ?? 0;

  const formattedOfferPrice = parseFloat(offerPrice) || 0;
  const formattedOriginalPrice = parseFloat(originalPrice) || formattedOfferPrice;
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const processingRef = useRef(false);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const offerPercentage = (originalPrice, offerPrice) => {
    if (!originalPrice || originalPrice <= 0 || !offerPrice || offerPrice <= 0) {
      return 0;
    }
    if (offerPrice >= originalPrice) {
      return 0;
    }
    const percentage = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(Math.max(0, percentage));
  };

  const navigate = useNavigate();

  const [addToCart] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isWishlistLoading }] = useAddToWishlistMutation();
  const [addToComparison, { isLoading: isComparisonLoading }] = useAddToComparisonMutation();

  // Use effectiveStock in the product object and include variant info
  const product = {
    _id,
    productId: _id,
    productName,
    stockQuantity: effectiveStock,
    originalPrice,
    offerPrice,
    category,
    // Include variant information for proper detection
    availableColors,
    availableSizes,
    availableGenders,
    hasVariants,
  };

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  const handleImageClick = () => navigate(`/product/${_id}`);

  // Determine if there's an active offer and its type
  const hasOffer = offerPrice && offerPrice < originalPrice;
  const discountPercentage = offerPercentage(originalPrice, offerPrice);

  // Determine offer type from offerInfo
  const offerType = offerInfo?.type || 'none';
  const isCategoryOffer = offerType === 'category';
  const isProductOffer = offerType === 'product';

  return (
    <div className="border rounded-lg text-lg shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.1)] overflow-hidden w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
      <div className="relative flex justify-center py-6 px-12 sm:py-8 items-center">
        <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] overflow:hidden">
          <img
            src={image}
            alt="Hover Test"
            className="w-full absolute z-10 h-full object-cover transform hover:scale-105 transition-transform rounded-md duration-300 cursor-pointer"
            onClick={handleImageClick}
          />
        </div>

        <div className="absolute top-2 left-0 right-0 bottom-0 flex justify-between p-2 mt-2">
          <div className="flex flex-col space-y-2 sm:space-y-4">
            {/* Show HOT badge for big discounts */}
            {discountPercentage >= 50 && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-md">
                ⚡HOT
              </div>
            )}
          </div>

          <div className="relative group">
            <div
              onClick={handleDropdownToggle}
              className={`bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-2xl sm:text-4xl ${showDropdown ? "rounded-t-full sm:pt-4" : "rounded-full sm:pt-1"
                } w-12 h-12 sm:w-[60px] sm:h-16 flex items-center pb-1 sm:pb-4  justify-center cursor-pointer`}
            >
              {showDropdown ? (
                <FaTimes
                  className={`text-xl sm:text-2xl md:text-4xl md:p-1 dark:bg-gray-600 bg-gray-200 p-1 rounded-full sm:p-2 shadow-lg`}
                />
              ) : (
                "+"
              )}
            </div>

            {showDropdown && (
              <div className="absolute top-14 left-0 space-y-2 sm:space-y-4 bg-white dark:bg-gray-600 p-1 sm:p-2 rounded-b-full shadow-lg">
                {icons.map(({ Icon, color, action, label }, index) => (
                  <div
                    key={index}
                    onClick={async (e) => {
                      e.stopPropagation();

                      // Handle View action separately (no auth needed, just navigate)
                      if (label === 'view') {
                        navigate(`/product/${_id}`);
                        return;
                      }

                      if (processingRef.current) return;
                      if (label === 'wishlist' && isWishlistLoading) return;
                      if (label === 'compare' && isComparisonLoading) return;

                      if (!isAuthenticated) {
                        const messages = {
                          wishlist: "Please log in to add items to your wishlist.",
                          compare: "Log in to compare products.",
                        };
                        toast.error(messages[label] || "Please log in to continue.");
                        return;
                      }

                      processingRef.current = true;
                      try {
                        await action(
                          _id,
                          {
                            addToWishlist,
                            addToComparison,
                          },
                          product,
                          label === "wishlist" ? wishlistData : comparisonData
                        );
                      } finally {
                        processingRef.current = false;
                      }
                    }}
                    className="bg-gray-200 dark:bg-gray-700 p-2 sm:p-3 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Icon className={`${color} text-sm sm:text-xl`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold">{productName}</h3>

        <div className="flex mt-2">
          {Array.from({ length: 5 }, (_, index) => {
            if (index + 1 <= Math.floor(averageRating)) {
              return <FaStar key={index} className="text-yellow-400" />;
            } else if (index < averageRating && averageRating % 1 !== 0) {
              return <FaStarHalfAlt key={index} className="text-yellow-400" />;
            } else {
              return <FaRegStar key={index} className="text-gray-300" />;
            }
          })}
        </div>

        <div className="flex space-x-3 sm:space-x-5 text-gray-700 dark:text-gray-300">
          <p className="text-sm sm:text-base">
            Rating:{" "}
            {typeof averageRating === "number" && !isNaN(averageRating)
              ? averageRating.toFixed(1)
              : "0.0"}
          </p>

          <p className="text-sm sm:text-base">({totalReviews} reviews)</p>
        </div>

        <div className="inline-flex items-center space-x-2">
          <span className="text-gray-500 line-through text-sm sm:text-base">
            &#8377;{formattedOriginalPrice.toFixed(2)}
          </span>
          <span className="text-red-500 font-semibold text-sm sm:text-base">
            &#8377;{formattedOfferPrice.toFixed(2)}
          </span>
        </div>

        {/* Improved Offer Badge with Clear Labeling */}
        {hasOffer && (
          <div className="mt-2">
            {isCategoryOffer && (
              <span className="text-xs px-3 py-1.5 rounded-full font-bold inline-flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                🏷️ Category Offer: {discountPercentage}% OFF
              </span>
            )}
            {isProductOffer && (
              <span className="text-xs px-3 py-1.5 rounded-full font-bold inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                🎁 Product Offer: {discountPercentage}% OFF
              </span>
            )}
            {!isCategoryOffer && !isProductOffer && (
              <span className="text-xs px-3 py-1.5 rounded-full font-bold inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please login to add items to cart");
              return;
            }
            handleAddToCart(_id, addToCart, setIsAdding, product, cartData);
          }}
          disabled={isAdding || effectiveStock <= 0}
          className={`w-full py-2 sm:py-3 flex border-yellow-500 border-2 justify-center items-center gap-2 rounded-full border font-semibold text-base sm:text-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition ${isAdding || effectiveStock <= 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-500 dark:hover:bg-yellow-600 cursor-pointer"
            }`}
        >
          {effectiveStock <= 0
            ? "Out of Stock"
            : isAdding
              ? "Adding..."
              : "Add to Cart"}
          {effectiveStock > 0 && !isAdding && <FaShoppingCart />}
        </button>
      </div>
    </div>
  );
};

export default ShoppingCard;
