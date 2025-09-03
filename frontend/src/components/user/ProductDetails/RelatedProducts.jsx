import { useState, useEffect } from "react";
import { useGetRelatedProductsQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import LoadingSpinner from "../../LoadingSpinner";

const RelatedProduct = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: relatedProduct = [],
    isLoading,
    isError,
  } = useGetRelatedProductsQuery(category, {
    skip: !category,
  });

  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();

  const updateProductsPerPage = () => {
    if (window.innerWidth >= 1240) {
      setProductsPerPage(7);
    } else if (window.innerWidth >= 1024) {
      setProductsPerPage(5);
    } else if (window.innerWidth >= 768) {
      setProductsPerPage(3);
    } else {
      setProductsPerPage(2);
    }
  };

  useEffect(() => {
    updateProductsPerPage();
    window.addEventListener("resize", updateProductsPerPage);
    return () => {
      window.removeEventListener("resize", updateProductsPerPage);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error fetching products.</div>;
  }

  if (!relatedProduct || relatedProduct.length === 0) {
    return (
      <div className="relative mx-5 lg:mx-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Related Products
        </h2>
        <div className="text-center py-10 text-gray-600 dark:text-gray-300">
          No related products available.
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    if (currentIndex + productsPerPage < relatedProduct.length) {
      setCurrentIndex(currentIndex + productsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - productsPerPage >= 0) {
      setCurrentIndex(currentIndex - productsPerPage);
    }
  };

  const handleAddToCart = async (id) => {
    const productDetails = {
      productId: id,
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

  const handleImageClick = async (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <div className="relative mx-5 lg:mx-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Related Products
        </h2>
        <div className="flex space-x-2 sm:space-x-4">
          <button
            onClick={prevSlide}
            className="bg-blue-500 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="bg-blue-500 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
            disabled={currentIndex + productsPerPage >= relatedProduct.length}
          >
            Next
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto gap-4 pb-4">
          {relatedProduct
            .slice(currentIndex, currentIndex + productsPerPage)
            .map((product, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out"
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  className="md:w-full md:h-64 h-44 w-44 cursor-pointer object-cover"
                  onClick={() => handleImageClick(product?._id)}
                />
                <div className="p-4 flex flex-col justify-between">
                  <h3 className="md:text-lg text-md font-medium text-gray-800 dark:text-gray-100 truncate">
                    {product.productName}
                  </h3>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, index) => {
                        const rating = product.averageRating;

                        if (index < Math.floor(rating)) {
                          return (
                            <FaStar
                              key={index}
                              className="text-yellow-500 md:text-xl"
                            />
                          );
                        } else if (
                          index < Math.ceil(rating) &&
                          rating % 1 !== 0
                        ) {
                          return (
                            <FaStarHalfAlt
                              key={index}
                              className="text-yellow-500 md:text-xl"
                            />
                          );
                        } else {
                          return (
                            <FaRegStar
                              key={index}
                              className="text-gray-300 md:text-xl"
                            />
                          );
                        }
                      })}
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-sm text-nowrap text-gray-500 ml-2">
                        <span className="block sm:hidden">
                          ({product.totalReviews || "N/A"})
                        </span>
                        <span className="hidden sm:inline">
                          ({product.totalReviews || "N/A"} reviews)
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    ₹ {product.offerPrice}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    {isAdding ? "Adding to Cart..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;
