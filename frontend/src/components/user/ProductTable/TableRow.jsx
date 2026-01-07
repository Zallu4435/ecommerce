import {
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/unifiedApiSlice";
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

  const navigate = useNavigate();

  // Get current cart data for validation
  const { data: cartData = [] } = useGetCartQuery();

  const handleAddToCart = () => {
    toast.info("Redirecting to product page to select variants...");
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 3000);
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
              ⭐ {item.averageRating?.toFixed(1) || 0} ({item.reviewCount || 0})
            </p>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">
          ₹ {(originalPrice || 0).toFixed(2)}
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
            disabled={!stockQuantity || stockQuantity === 0 || cartData?.some(item => item.productId === productId)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${!stockQuantity || stockQuantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : cartData?.some(item => item.productId === productId)
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105'
              }`}
          >
            {!stockQuantity || stockQuantity === 0
              ? "Out of Stock"
              : cartData?.some(item => item.productId === productId)
                ? "In Cart"
                : "Add to Cart"
            }
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
            ₹ {(originalPrice || 0).toFixed(2)}
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
              ⭐ {item.averageRating?.toFixed(1) || 0} ({item.reviewCount || 0} reviews)
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
            disabled={!stockQuantity || stockQuantity === 0 || cartData?.some(item => item.productId === productId)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${!stockQuantity || stockQuantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : cartData?.some(item => item.productId === productId)
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
          >
            {!stockQuantity || stockQuantity === 0
              ? "Out of Stock"
              : cartData?.some(item => item.productId === productId)
                ? "In Cart"
                : "Add to Cart"
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default TableRow;
