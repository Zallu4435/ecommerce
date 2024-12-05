import React from 'react';
import { config } from './TableRow'; // Assuming TableRow and config are imported correctly

const ProductTable = ({ type, data }) => {
  const { headers, rowRenderer } = config[type];  // Destructure headers and rowRenderer from config

  return (
    <div className='m-10'>
      {/* Wishlist Heading */}
      {type === 'wishlist' && (
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Wishlist</h2>
      )}

      {/* Table */}
      <table className="w-full table-auto">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-left whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="space-y-4">
          {data.map(item => rowRenderer(item))} {/* Map through data and call rowRenderer */}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
