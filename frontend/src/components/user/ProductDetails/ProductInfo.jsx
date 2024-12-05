import React from 'react';

const ProductInfo = () => {
  return (
    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Dummy Product Name</h1>
      <p className="text-2xl font-semibold text-green-600 mb-6">$199.99</p>
      <p className="text-gray-700 leading-relaxed mb-6">
        Experience the best with this amazing product! Equipped with top-notch features and a sleek design, it’s the ultimate choice for anyone seeking excellence.
      </p>

      {/* Specifications */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Specifications</h2>
      <table className="w-full text-left text-gray-700">
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
