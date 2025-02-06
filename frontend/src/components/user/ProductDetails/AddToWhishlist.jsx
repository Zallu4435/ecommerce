import { useState } from "react";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
} from "../../../redux/apiSliceFeatures/WishlistApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddToWishlist = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const { refetch: refetchWishlist } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();

  const handleAddToWishlist = async () => {
    setIsLoading(true);
    try {
      await addToWishlist(productId);
      await refetchWishlist();
      toast.success("Product added to wishlist");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleAddToWishlist}
        disabled={!isAuthenticated || isLoading}
        className={`w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400
         ${
           !isAuthenticated || isLoading ? "opacity-50 cursor-not-allowed" : ""
         }`}
      >
        {isAuthenticated
          ? "Add to Wishlist ❤️"
          : "SignIn to add to Wishlist ❤️"}
      </button>
    </div>
  );
};

export default AddToWishlist;
