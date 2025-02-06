import { useState } from "react";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TableRow = ({ item, onRemove }) => {
  const {
    originalPrice,
    productName,
    cartItemId,
    productImage,
    stockQuantity,
    productId,
  } = item;

  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();

  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const productDetails = {
      productId: productId,
      quantity: 1,
    };

    try {
      setIsAdding(true);
      await addToCart(productDetails);
      await refetchCart();

      onRemove(productId); 

      toast.success("Item added to cart!");
    } catch (error) {
      toast.error(error.message || "Failed to add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageClick = () => navigate(`/product/${productId}`);

  return (
    <>
      {/* Full Row for Larger Screens */}
      <tr className="hidden md:table-row hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <td className="px-6 py-4 border-b text-center">
          <button
            className="text-red-500 hover:underline"
            onClick={() => onRemove(productId)}
          >
            ❌ Remove
          </button>
        </td>
        <td className="px-6 py-4 md:px-0 border-b flex items-center gap-4">
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
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ⭐ 4.5 (200)
            </p>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
          ₹ {originalPrice.toFixed(2)}
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
          {stockQuantity ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
              In Stock
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md font-semibold">
              Out of Stock
            </span>
          )}
        </td>

        <td className="px-6 py-4 border-b text-center">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isAdding ? "Adding to Cart..." : "Add to Cart"}
          </button>
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
          <span className="text-gray-900 dark:text-gray-100">
            ₹ {originalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={productImage}
            className="h-[60px] rounded-lg object-cover"
            alt={productName}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {productName}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ⭐ 4.5 (200 reviews)
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            stockQuantity:
          </span>
          <span>{stockQuantity}</span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isAdding ? "Adding to Cart..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TableRow;
