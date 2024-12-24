import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing a close icon

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Order Items</h2>
        <ul className="space-y-4">
          {order.Items.map((item, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <img
                  src={item.ProductImage}
                  alt={item.ProductName}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.ProductName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.Quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
