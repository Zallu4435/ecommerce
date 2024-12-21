import React, { useState } from "react";
import { useAddToWishlistMutation, useGetWishlistQuery } from "../../../redux/apiSliceFeatures/WishlistApiSlice";
import { toast } from "react-toastify";

const AddToWishlist = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false); // To handle loading state

  const { refetch: refetchWishlist } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();

  const handleAddToWishlist = async () => {
    setIsLoading(true);
    try {
      // Add the product to the wishlist
      const response = await addToWishlist(productId);

      // Only show the toast message if the product was successfully added
      if (response?.data?.success) {
        await refetchWishlist();
        toast.success('Product added to wishlist');
      } else {
        toast.error('Failed to add product to wishlist');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleAddToWishlist}
        disabled={isLoading} // Disable button while loading
        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
      >
        {isLoading ? 'Loading...' : "Add to Wishlist ❤️"}
      </button>
    </div>
  );
};

export default AddToWishlist;
