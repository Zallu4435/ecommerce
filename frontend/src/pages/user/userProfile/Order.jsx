import React from 'react';
import { orders } from '../productsData';

const OrdersTable = () => {
  const headers = ['Order ID', 'Product', 'Quantity', 'Total', 'Status', 'Delivery Date'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Your Orders</h2>
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{order.id}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{order.productName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{order.quantity}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">${order.totalPrice.toFixed(2)}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold ${
                  order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>
                {order.status}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {order.deliveryDate || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
