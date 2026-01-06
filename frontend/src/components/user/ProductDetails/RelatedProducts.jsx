import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetRelatedProductsQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
} from "../../../redux/apiSliceFeatures/unifiedApiSlice";
import { toast } from "react-toastify";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner";

const RelatedProducts = ({ category }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);

  const isAuthenticated = useSelector((state) => state?.user?.isAuthenticated);

  const {
    data: relatedProducts = [],
    isLoading,
    isError,
  } = useGetRelatedProductsQuery(category, {
    skip: !category,
  });

  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const updateProductsPerPage = () => {
    if (window.innerWidth >= 1280) {
      setProductsPerPage(5);
    } else if (window.innerWidth >= 1024) {
      setProductsPerPage(4);
    } else if (window.innerWidth >= 768) {
      setProductsPerPage(3);
    } else if (window.innerWidth >= 640) {
      setProductsPerPage(2);
    } else {
      setProductsPerPage(1);
    }
  };

  useEffect(() => {
    updateProductsPerPage();
    window.addEventListener("resize", updateProductsPerPage);
    return () => {
      window.removeEventListener("resize", updateProductsPerPage);
    };
  }, []);

  const nextSlide = () => {
    if (currentIndex + productsPerPage < relatedProducts.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (product?.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const productDetails = {
      productId: product._id,
      quantity: 1,
    };

    try {
      setAddingToCart(product._id);
      await addToCart(productDetails).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      setAddingToWishlist(productId);
      const response = await addToWishlist(productId).unwrap();
      toast.success(response?.message || "Added to wishlist!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to wishlist");
    } finally {
      setAddingToWishlist(null);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
              }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <div className="text-center text-red-500 dark:text-red-400">
          Error loading related products
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // Don't show section if no products
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + productsPerPage < relatedProducts.length;
  const visibleProducts = relatedProducts.slice(currentIndex, currentIndex + productsPerPage);

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              You May Also Like
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Similar products in {category}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleAddToWishlist(product._id, e)}
                      disabled={addingToWishlist === product._id}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      aria-label="Add to wishlist"
                    >
                      {addingToWishlist === product._id ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                      ) : (
                        <Heart className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product._id);
                      }}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Discount Badge */}
                  {product.basePrice > product.offerPrice && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                    {product.productName}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(product.averageRating || 0)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({product.totalReviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{product.offerPrice?.toLocaleString()}
                    </span>
                    {product.basePrice > product.offerPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.basePrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product._id || product.stockQuantity <= 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {addingToCart === product._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                        <span className="text-sm">Adding...</span>
                      </>
                    ) : product.stockQuantity <= 0 ? (
                      <span className="text-sm">Out of Stock</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {relatedProducts.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
