import React from 'react';

const ProductGrid = ({ compareItem, handleAddToCart, handleRemoveProduct, isAdding }) => {
  const renderProductCard = (product, index) => (
    <div
      key={product.productId}
      className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 ${index === 2 ? 'lg:col-span-1 lg:mx-auto md:ml-[160px] md:w-[400px] lg:w-full' : ''}`}
    >
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{product.productName}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">₹ {product.originalPrice.toFixed(2)}</span>
        <div className="text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < product.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleRemoveProduct(product.productId)}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Remove from Compare
        </button>
        <button
          onClick={() => handleAddToCart(product.productId)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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

