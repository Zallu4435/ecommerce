import { useEffect } from "react";
import {
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../../redux/apiSliceFeatures/WishlistApiSlice";
import ProductTable from "../../components/user/ProductTable/ProductTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";

const Wishlist = () => {
  const { data: wishlist = [], isLoading, isError } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleRemove = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      if (response && response.status === 200) {
        toast.success(`Removed product`);
      }
    } catch (error) {
      console.error("Failed to remove product from wishlist", error);
    }
  };
  useEffect(() => {
    if (wishlist?.length > 15) {
      toast.error(
        "You can only add up to 15 products in your wishlist. Please remove some before adding more."
      );
    }
  }, [wishlist?.length]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen md:p-10 p-5">
      <div className="max-w-7xl mx-auto">
        {isLoading && <LoadingSpinner />}
        {isError && <div>Error fetching wishlist</div>}

        {wishlist?.length === 0 ? (
          <div className="text-center text-xl text-gray-600 dark:text-gray-400">
            Your wishlist is empty. Add some products to your wishlist!
          </div>
        ) : (
          <ProductTable
            type="wishlist"
            data={wishlist}
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
