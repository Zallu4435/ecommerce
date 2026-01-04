import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetComparisonListQuery,
  useRemoveFromComparisonMutation,
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/unifiedApiSlice";
import { toast } from "react-toastify";
import ComparisonCard from "./ComparisonCard";
import ComparisonTable from "./ComparisonTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { validateAddToCart, handleApiError } from "../../../utils/edgeCaseValidators";

const Compare = () => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: compareItem = [],
    isLoading,
    isError,
  } = useGetComparisonListQuery();
  const { data: cartData = [] } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromComparison] = useRemoveFromComparisonMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error fetching comparison list</div>;
  }

  const handleAddToCart = async (productId) => {
    // Find product in comparison list to get stock info
    const product = compareItem.find(item => item.productId === productId);

    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Use centralized validation
    const validation = validateAddToCart({
      product,
      cartData,
      stockQuantity: product.stockQuantity,
    });

    if (!validation.valid) {
      return; // Validation already showed appropriate toast message
    }

    const productDetails = {
      productId: productId,
      quantity: 1,
    };

    try {
      setIsAdding(true);
      await addToCart(productDetails);

      // Remove from comparison after successfully adding to cart
      // Backend already removed it, this just updates the UI immediately
      await removeFromComparison(productId);

      toast.success(`Item moved to cart successfully! ${validation.warning || ""}`);
    } catch (error) {
      // Use centralized error handler
      handleApiError(error, "add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await removeFromComparison(productId);
      if (response?.data?.comparison) {
        toast.success(
          "Product removed from comparison:",
          response.data.comparison
        );
      } else {
        toast.error("Error removing product from comparison");
      }
    } catch (error) {
      toast.error("Error:", error.message);
    }
  };

  const isEmpty = !compareItem || compareItem.length === 0;

  return (
    <div className="p-6 bg-gray-50 my-10 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {!isEmpty && (
        <h1 className="text-3xl font-bold text-center text-gray-600 dark:text-gray-200 mb-8">
          Product Comparison
        </h1>
      )}

      {isEmpty ? (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-gray-700 flex items-center justify-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-purple-600 dark:text-purple-400"
            >
              <path d="M3.75 6.75A1.5 1.5 0 015.25 5.25h13.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V6.75zm3 1.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75zM6 12a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 3.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your comparison list is empty
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md text-center">
            Compare features and prices side by side. Add products to start comparing.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Browse products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ComparisonCard
            compareItem={compareItem}
            handleAddToCart={handleAddToCart}
            handleRemoveProduct={handleRemoveProduct}
            isAdding={isAdding}
            cartData={cartData}
          />
          <ComparisonTable compareItem={compareItem} />
        </>
      )}
    </div>
  );
};

export default Compare;
