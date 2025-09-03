import { useEffect } from "react";
import {
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../../redux/apiSliceFeatures/WishlistApiSlice";
import ProductTable from "../../components/user/ProductTable/ProductTable";
import { Link } from "react-router-dom";
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
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.453C4.688 16.045 2.25 13.446 2.25 10.5 2.25 7.75 4.3 5.75 6.75 5.75c1.676 0 3.064.711 4 1.877C11.686 6.46 13.074 5.75 14.75 5.75c2.45 0 4.5 2 4.5 4.75 0 2.946-2.438 5.545-4.739 7.77a25.175 25.175 0 01-4.244 2.453 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.75.75 0 01-.61 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md text-center">
              Save items you love to your wishlist to keep track of them and shop later.
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
