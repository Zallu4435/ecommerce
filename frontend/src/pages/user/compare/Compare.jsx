import { useState } from "react";
import {
  useGetComparisonListQuery,
  useRemoveFromComparisonMutation,
} from "../../../redux/apiSliceFeatures/ComparisonApiSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";
import ComparisonCard from "./ComparisonCard";
import ComparisonTable from "./ComparisonTable";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Compare = () => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: compareItem = [],
    isLoading,
    isError,
  } = useGetComparisonListQuery();
  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromComparison] = useRemoveFromComparisonMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error fetching comparison list</div>;
  }

  const handleAddToCart = async (productId) => {
    const productDetails = {
      productId: productId,
      quantity: 1,
    };

    try {
      setIsAdding(true);
      await addToCart(productDetails);
      await refetchCart();
      toast.success("Item added to cart!");
    } catch (error) {
      toast.error(error.message || "Failed to add item to cart.");
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

  return (
    <div className="p-6 bg-gray-50 my-10 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-600 dark:text-gray-200 mb-8">
        Product Comparison
      </h1>
      <ComparisonCard
        compareItem={compareItem}
        handleAddToCart={handleAddToCart}
        handleRemoveProduct={handleRemoveProduct}
        isAdding={isAdding}
      />
      <ComparisonTable compareItem={compareItem} />
    </div>
  );
};

export default Compare;
