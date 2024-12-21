import React from 'react';

const ComparisonTable = ({ compareItem }) => {
  return (
    <div className="mt-10 overflow-x-auto hidden lg:block md:block">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Comparison Table</h2>
      <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm sm:text-base">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-100">Feature</th>
            {compareItem.map((product) => (
              <th key={product.productId} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">
                {product.productName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['Price', 'Rating', 'Description'].map((feature) => (
            <tr key={feature}>
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{feature}</td>
              {compareItem.map((product) => (
                <td key={product.productId} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">
                  {feature === 'Price' ? `$${product.originalPrice.toFixed(2)}` : 
                  feature === 'Rating' ? Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < product.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                  )) :
                  product.description}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;

