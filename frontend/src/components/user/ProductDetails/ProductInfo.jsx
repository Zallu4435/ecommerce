import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const ProductInfo = ({
  productName,
  originalPrice,
  description,
  averageRating,
  totalReviews,
  offerPrice,
}) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        {/* Product Name */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          {productName}
        </h1>

        {/* Rating with icons */}
        <div className="flex items-center">
          <div className="flex text-yellow-500 mr-2">
            {[...Array(5)].map((_, index) => {
              if (index < Math.floor(averageRating)) {
                return <FaStar key={index} className="text-lg sm:text-xl" />;
              } else if (
                index < Math.ceil(averageRating) &&
                averageRating % 1 !== 0
              ) {
                return <FaStarHalfAlt key={index} className="text-lg sm:text-xl" />;
              } else {
                return (
                  <FaRegStar key={index} className="text-lg sm:text-xl text-gray-300" />
                );
              }
            })}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            ({totalReviews} reviews)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-5 items-center mb-4 sm:mb-6">
        <p className="text-xl sm:text-2xl font-semibold text-gray-500 line-through">
          ₹ {originalPrice}
        </p>
        <p className="text-xl sm:text-2xl font-semibold text-green-600">
          ₹ {offerPrice}
        </p>
      </div>

      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
        {description}
      </p>

      {/* Specifications */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
        Specifications
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-700 dark:text-gray-300">
          <tbody>
            <tr className="border-b">
              <td className="py-2 pr-4 font-semibold text-sm sm:text-base">Material</td>
              <td className="py-2 text-sm sm:text-base">Premium Alloy</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-semibold text-sm sm:text-base">Dimensions</td>
              <td className="py-2 text-sm sm:text-base">15x10x5 inches</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-semibold text-sm sm:text-base">Warranty</td>
              <td className="py-2 text-sm sm:text-base">1 Year</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductInfo;