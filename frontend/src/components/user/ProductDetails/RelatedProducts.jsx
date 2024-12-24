import React, { useState, useEffect } from "react";
import { useGetRelatedProductsQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";

const RelatedProduct = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: relatedProduct = [],
    isLoading,
    isError,
  } = useGetRelatedProductsQuery(category, {
    skip: !category, // Skip the query if no category is passed
  });
  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();

  // Function to update the products per page based on window width
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

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching products.</div>;
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

  return (
    <div className="relative mt-12 mx-5 lg:mx-12">
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4 absolute top-[-20px] right-0 space-x-6">
        <button
          onClick={prevSlide}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={currentIndex + productsPerPage >= relatedProduct.length}
        >
          Next
        </button>
      </div>

      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Related Products
      </h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 pb-4">
          {relatedProduct
            .slice(currentIndex, currentIndex + productsPerPage)
            .map((product, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out"
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-64 object-cover"
                />
                {/* Product Info */}
                <div className="p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
                    {product.productName}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span>{product.rating || "N/A"}</span>
                  </div>
                  {/* Price */}
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    ₹ {product.offerPrice}
                  </p>
                  {/* Add to Cart Button */}
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
