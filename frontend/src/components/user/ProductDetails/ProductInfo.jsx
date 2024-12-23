import React from "react";

const ProductInfo = ({ productName, originalPrice, description }) => {
  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {productName}
      </h1>
      <p className="text-2xl font-semibold text-green-600 mb-6">
        ₹ {originalPrice}
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {description}{" "}
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
