import React, { useState } from "react";
import { useUpdateQuantityMutation } from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TableRowForCartlist = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const navigate = useNavigate();

  const {
    productId,
    originalPrice,
    productName,
    cartItemId,
    productImage,
    totalReviews,
    averageRating,
    stockQuantity
  } = item;

  console.log(item, 'item from cart')
  const [updateQuantity] = useUpdateQuantityMutation();

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

  const calculateSubtotal = () => (originalPrice * quantity).toFixed(2);

  const handleImageClick = () => navigate(`/product/${productId}`);

  return (
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
          className="h-[60px] rounded-lg cursor-pointer object-cover"
          alt={productName}
          onClick={handleImageClick}
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {productName}
          </p>
          <div className="flex items-center mt-2">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, index) => {
                const rating = averageRating;
                if (index < Math.floor(rating)) {
                  return (
                    <FaStar key={index} className="text-yellow-500 text-sm" />
                  );
                } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
                  return (
                    <FaStarHalfAlt
                      key={index}
                      className="text-yellow-500 text-sm"
                    />
                  );
                } else {
                  return (
                    <FaRegStar key={index} className="text-gray-300 text-sm" />
                  );
                }
              })}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-500 ml-2">
                ({totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 border-b text-center">
        {isOutOfStock || stockQuantity == 0 ? (
          <span className="text-red-500 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-md text-sm font-semibold animate-pulse">
            Out of Stock
          </span>
        ) : (
          <span className="text-green-500 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md text-sm font-semibold">
            In Stock
          </span>
        )}
      </td>
      <td className="px-6 py-4 border-b text-center">
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
            disabled={isOutOfStock || quantity >= 7 || stockQuantity == 0 }
          >
            +
          </button>
        </div>
      </td>
      <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
        ₹ {originalPrice}
      </td>
      <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
        ₹ {calculateSubtotal()}
      </td>
    </tr>
  );
};

export default TableRowForCartlist;

