import React, { useState, useEffect } from "react";
import { useUpdateQuantityMutation } from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";

const TableRowForCartlist = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);

  const { originalPrice, productName, cartItemId, productImage, stockQuantity } = item;

  const [updateQuantity] = useUpdateQuantityMutation();

  // Calculate isOutOfStock dynamically from the item
  const isOutOfStock = stockQuantity <= 0;

  const handleQuantityUpdate = async (newQuantity) => {
    try {
      const response = await updateQuantity({
        cartItemId,
        quantity: newQuantity,
      });

      if (response?.error) {
        toast.error("Out of Stock!");
      } else {
        setQuantity(newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const handleIncrease = () => {
    if (!isOutOfStock) {
      handleQuantityUpdate(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleQuantityUpdate(quantity - 1);
    }
  };

  const calculateSubtotal = () => (originalPrice * quantity).toFixed(2);

  return (
    <>
      {/* Full Row for Larger Screens */}
      <tr className="hidden md:table-row hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <td className="px-6 py-4 border-b text-center">
          <button
            className="text-red-500 hover:underline"
            onClick={() => onRemove(cartItemId)}
          >
            ❌ Remove
          </button>
        </td>
        <td className="px-6 py-4 border-b flex items-center gap-4">
          <img
            src={productImage}
            className="h-[60px] rounded-lg object-cover"
            alt={productName}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {productName}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 text-nowrap dark:text-gray-400">
              ⭐ 4.5 (200)
            </p>
          </div>
          {isOutOfStock && (
            <span className="text-red-500 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-md text-sm font-semibold animate-bounce">
              Out of Stock
            </span>
          )}
        </td>
        <td className="px-6 py-4 border-b text-center">
          <div className="flex items-center justify-center">
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="px-4 py-1 text-gray-800 dark:text-gray-100">
              {quantity}
            </span>
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleIncrease}
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

      {/* Collapsed Card for Smaller Screens */}
      <div className="block md:hidden border rounded-lg p-4 mb-4 shadow-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={() => onRemove(cartItemId)}
          >
            ❌ Remove
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={productImage}
            className="h-[60px] rounded-lg object-cover"
            alt={productName}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{productName}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ⭐ 4.5 (200 reviews)
            </p>
          </div>
          {isOutOfStock && (
            <span className="text-red-500 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-md text-sm font-semibold animate-bounce">
              Out of Stock
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {quantity}
          </span>
          <div className="flex items-center">
            <button
              className="px-2 py-0 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="px-2 py-0 text-gray-800 dark:text-gray-100">
              {quantity}
            </span>
            <button
              className="px-2 py-0 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Subtotal:
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ₹ {calculateSubtotal()}
          </span>
        </div>
      </div>
    </>
  );
};

export default TableRowForCartlist;
