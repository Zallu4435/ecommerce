import React from 'react';
import TableRow from './TableRow';

const ProductTable = ({ type, data, onRemove }) => {
  return (
    <div className="flex flex-col items-center justify-center m-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      {/* Heading */}
      {type === 'wishlist' && (
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Your Wishlist
        </h2>
      )}

      {/* Full Table for Larger Screens */}
      <div className="overflow-x-auto w-full max-w-6xl hidden md:block">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                Remove
              </th>
              <th className="px-6 py-4 text-left border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                Product Name
              </th>
              <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                Price
              </th>
              <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                Quantity
              </th>
              <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <TableRow key={item.id} item={item} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Collapsed Cards for Small Screens */}
      <div className="grid gap-6 md:hidden w-full max-w-6xl mt-6">
        {data.map((item) => (
          <TableRow key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
