import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"; // Importing the star icons

const ProductInfo = ({
  productName,
  originalPrice,
  description,
  averageRating,
  totalReviews,
  offerPrice,
}) => {
  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        {/* Product Name */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {productName}
        </h1>

        {/* Rating with icons */}
        <div className="flex items-center">
          <div className="flex text-yellow-500 mr-2">
            {[...Array(5)].map((_, index) => {
              if (index < Math.floor(averageRating)) {
                return <FaStar key={index} className="text-xl" />; // Full Star
              } else if (
                index < Math.ceil(averageRating) &&
                averageRating % 1 !== 0
              ) {
                return <FaStarHalfAlt key={index} className="text-xl" />; // Half Star
              } else {
                return (
                  <FaRegStar key={index} className="text-xl text-gray-300" />
                ); // Empty Star
              }
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ({totalReviews} reviews)
          </p>
        </div>
      </div>

      <div className="flex gap-5 items-center mb-6">
        <p className="text-2xl font-semibold text-gray-500 line-through">
          ₹ {originalPrice}
        </p>
        <p className="text-2xl font-semibold text-green-600">₹ {offerPrice}</p>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {description}
      </p>

      {/* Specifications */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Specifications
      </h2>
      <table className="w-full text-left text-gray-700 dark:text-gray-300">
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-semibold">Material</td>
            <td className="py-2">Premium Alloy</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-semibold">Dimensions</td>
            <td className="py-2">15x10x5 inches</td>
          </tr>
          <tr>
            <td className="py-2 font-semibold">Warranty</td>
            <td className="py-2">1 Year</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductInfo;
