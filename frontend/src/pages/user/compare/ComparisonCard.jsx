import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({
  compareItem,
  handleAddToCart,
  handleRemoveProduct,
  isAdding,
}) => {
  const navigate = useNavigate();
  const handleImageClick = (productId) => navigate(`/product/${productId}`);

  const renderProductCard = (product, index) => (
    <div
      key={product.productId}
      className={`border p-4 rounded-lg shadow-lg hover:shadow-xl mb-10 transition-all bg-white dark:bg-gray-800 ${
        index === 2
          ? "lg:col-span-1 lg:mx-auto md:ml-[160px] md:w-[400px] lg:w-full"
          : ""
      }`}
    >
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-full h-64 object-cover cursor-pointer rounded-md mb-4"
        onClick={() => handleImageClick(product?.productId)}
      />
      <h2 className="text-xl font-bold text-gray-600 dark:text-gray-200 mb-2">
        {product.productName.toUpperCase()}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {product.description}
      </p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-gray-600 dark:text-gray-200">
          ₹ {product.originalPrice.toFixed(2)}
        </span>
        <div className="flex items-center mt-2">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, index) => {
              const rating = product?.averageRating;
              if (index < Math.floor(rating)) {
                return (
                  <FaStar key={index} className="text-yellow-500 text-sm" />
                );
              } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
                return (
                  <FaStarHalfAlt
                    key={index}
                    className="text-yellow-500 text-sm"
                  />
                );
              } else {
                return (
                  <FaRegStar key={index} className="text-gray-300 text-sm" />
                );
              }
            })}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-500 ml-2">
              ({product?.reviewCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleRemoveProduct(product.productId)}
          className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-500 transition"
        >
          Remove from Compare
        </button>
        <button
          onClick={() => handleAddToCart(product.productId)}
          className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition"
        >
          {isAdding ? "Adding to Cart..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {compareItem.map((product, index) => renderProductCard(product, index))}
    </div>
  );
};

export default ProductGrid;
