import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { roundedImg_1 } from '../../../assets/images';

const TableRowForCartlist = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const calculateSubtotal = () => (item.price * quantity).toFixed(2);

  return (
    <>
      {/* Full Row for Larger Screens */}
      <tr className="hidden md:table-row hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <td className="px-6 py-4 border-b text-center">
          <button className="text-red-500 hover:underline" onClick={() => onRemove(item.id)}>
            ❌ Remove
          </button>
        </td>
        <td className="px-6 py-4 border-b flex items-center gap-4">
          <img
            src={roundedImg_1}
            className="h-[60px] rounded-lg object-cover"
            alt={item.name}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">⭐ 4.5 (200 reviews)</p>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</td>
        <td className="px-6 py-4 border-b text-center">
          <div className="flex items-center justify-center">
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="px-4 py-1 text-gray-800 dark:text-gray-100">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">${calculateSubtotal()}</td>
      </tr>

      {/* Collapsed Card for Smaller Screens */}
      <div className="block md:hidden border rounded-lg p-4 mb-4 shadow-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={() => onRemove(item.id)}
          >
            ❌ Remove
          </button>
          <span className="text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={roundedImg_1}
            className="h-[60px] rounded-lg object-cover"
            alt={item.name}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">⭐ 4.5 (200 reviews)</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
          <div className="flex items-center">
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="px-4 py-1 text-gray-800 dark:text-gray-100">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">${calculateSubtotal()}</span>
        </div>
      </div>
    </>
  );
};

export default TableRowForCartlist;
