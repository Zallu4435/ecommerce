import { useState, useEffect } from "react";
import {
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../../redux/apiSliceFeatures/WishlistApiSlice";
import ProductTable from "../../components/user/ProductTable/ProductTable";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Wishlist = () => {
  const { data: wishlist = [], isLoading, isError } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // console.log(wishlist, "data from the wishlist ");

  const handleRemove = async (productId) => {
    try {
      const response = await removeFromWishlist(productId); // Assuming this returns a response object
      if (response && response.status === 200) {
        toast.success(`Removed product`);
      }
    } catch (error) {
      console.error("Failed to remove product from wishlist", error);
    }
  };
  
  // Show toast if wishlist exceeds 15 products
  useEffect(() => {
    if (wishlist?.items?.length > 15) {
      toast.error(
        "You can only add up to 15 products in your wishlist. Please remove some before adding more."
      );
    }
  }, [wishlist?.items?.length]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen md:p-10 p-5">
      <div className="max-w-7xl mx-auto">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error fetching wishlist</div>}

        {/* Show message if wishlist is empty */}
        {wishlist?.items?.length === 0 ? (
          <div className="text-center text-xl text-gray-600 dark:text-gray-400">
            Your wishlist is empty. Add some products to your wishlist!
          </div>
        ) : (
          <ProductTable
            type="wishlist"
            data={wishlist} // Pass wishlist items directly
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
