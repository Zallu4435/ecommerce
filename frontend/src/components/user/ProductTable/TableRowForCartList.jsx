import { useState } from "react";
import { useUpdateQuantityMutation } from "../../../redux/apiSliceFeatures/unifiedApiSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TableRowForCartlist = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const navigate = useNavigate();

  const [updateQuantity] = useUpdateQuantityMutation();

  const {
    productId,
    originalPrice,
    offerPrice,
    offerInfo,
    productName,
    cartItemId,
    productImage,
    totalReviews,
    averageRating,
    stockQuantity
  } = item;

  const finalPrice = offerPrice || originalPrice;
  const hasDiscount = originalPrice > finalPrice;

  const handleQuantityUpdate = async (newQuantity) => {
    try {
      const response = await updateQuantity({
        cartItemId,
        quantity: newQuantity,
      });

      if (response.error) {
        if (response.error.status == 400) {
          setIsOutOfStock(true);
          toast.error("Out of Stock!");
        } else {
          toast.error("Failed to update quantity. Please try again.");
        }
      } else {
        setQuantity(newQuantity);
        setIsOutOfStock(false);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const handleIncrease = () => {
    if (!isOutOfStock && quantity < 7) {
      handleQuantityUpdate(quantity + 1);
    } else if (isOutOfStock) {
      toast.error("Out of Stock!");
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleQuantityUpdate(quantity - 1);
    }
  };

  const calculateSubtotal = () => (finalPrice * quantity).toFixed(2);

  const handleImageClick = () => navigate(`/product/${productId}`);

  const RatingStars = () => (
    <div className="flex items-center">
      <div className="flex items-center mr-2">
        {[...Array(5)].map((_, index) => {
          const rating = averageRating;
          if (index < Math.floor(rating)) {
            return <FaStar key={index} className="text-yellow-500 text-sm" />;
          } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
            return <FaStarHalfAlt key={index} className="text-yellow-500 text-sm" />;
          } else {
            return <FaRegStar key={index} className="text-gray-300 text-sm" />;
          }
        })}
      </div>
      <span className="text-sm text-gray-500 ml-2">
        ({totalReviews || 0} reviews)
      </span>
    </div>
  );

  const QuantityControls = () => (
    <div className="flex items-center justify-center">
      <button
        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
        onClick={handleDecrease}
        disabled={stockQuantity == 0}
      >
        -
      </button>
      <span className="px-4 py-1 text-gray-800 dark:text-gray-100">
        {quantity}
      </span>
      <button
        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleIncrease}
        disabled={isOutOfStock || quantity >= 7 || stockQuantity == 0}
      >
        +
      </button>
    </div>
  );

  const StockStatus = () => (
    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${isOutOfStock || stockQuantity == 0
      ? "text-red-500 bg-red-100 dark:bg-red-900 animate-pulse"
      : "text-green-500 bg-green-100 dark:bg-green-900"
      }`}>
      {isOutOfStock || stockQuantity == 0 ? "Out of Stock" : "In Stock"}
    </span>
  );

  return (
    <>
      {/* Mobile and Tablet View */}
      <div className="md:hidden p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <img
              src={productImage}
              className="h-20 w-20 rounded-lg cursor-pointer object-cover"
              alt={productName}
              onClick={handleImageClick}
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {productName}
              </p>
              {(item.color || item.size || item.gender) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {[
                    item.color,
                    item.size,
                    item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender
                  ].filter(Boolean).join(" | ")}
                </p>
              )}
              <RatingStars />
            </div>
          </div>
          <button
            className="text-red-500 font-bold"
            onClick={() => onRemove(cartItemId)}
          >
            ❌
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Status:</span>
            <StockStatus />
          </div>

          {/* Offer Badge */}
          {hasDiscount && offerInfo && offerInfo.type !== 'none' && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Offer:</span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${offerInfo.type === 'category'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                <span>{offerInfo.type === 'category' ? '🏷️' : '🎁'}</span>
                <span>{offerInfo.percentage}% OFF</span>
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Price:</span>
            <div className="flex flex-col items-end">
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹ {originalPrice}</span>
              )}
              <span className="text-gray-900 dark:text-gray-100 font-bold">₹ {finalPrice}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
            <QuantityControls />
          </div>

          <div className="flex justify-between items-center font-semibold">
            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="text-gray-900 dark:text-gray-100">₹ {calculateSubtotal()}</span>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <tr className="hidden md:table-row hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <td className="px-6 py-4 border-b text-center">
          <button
            className="text-red-500 font-bold hover:underline"
            onClick={() => onRemove(cartItemId)}
          >
            ❌ Remove
          </button>
        </td>
        <td className="px-6 py-4 border-b flex items-center gap-4">
          <img
            src={productImage}
            className="h-[60px] w-[60px] rounded-lg cursor-pointer object-cover"
            alt={productName}
            onClick={handleImageClick}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {productName}
            </p>
            {(item.color || item.size || item.gender) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {[
                  item.color,
                  item.size,
                  item.gender === "Male" ? "Boy" : item.gender === "Female" ? "Girl" : item.gender
                ].filter(Boolean).join(" | ")}
              </p>
            )}
            <RatingStars />
            {/* Offer Badge for Desktop */}
            {hasDiscount && offerInfo && offerInfo.type !== 'none' && (
              <span className={`text-xs px-2 py-0.5 mt-1 rounded-full font-bold inline-flex items-center gap-1 ${offerInfo.type === 'category'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                <span>{offerInfo.type === 'category' ? '🏷️' : '🎁'}</span>
                <span>{offerInfo.percentage}% OFF</span>
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center">
          <StockStatus />
        </td>
        <td className="px-6 py-4 border-b text-center">
          <QuantityControls />
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
          <div className="flex flex-col items-center">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹ {originalPrice}</span>
            )}
            <span className="font-bold">₹ {finalPrice}</span>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
          ₹ {calculateSubtotal()}
        </td>
      </tr>
    </>
  );
};

export default TableRowForCartlist;