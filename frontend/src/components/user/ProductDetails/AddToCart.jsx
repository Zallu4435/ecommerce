import React, { useState } from 'react';

const AddToCart = () => {
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState('');

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleApplyCoupon = () => {
    alert(`Coupon "${coupon}" applied successfully!`);
  };

  return (
    <div className="p-6 bg-blue-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

      {/* Price */}
      <p className="text-xl font-bold text-gray-800">Price: $199.99</p>
      <p className="text-sm text-green-600 mb-4">In Stock</p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <p className="text-gray-700">Quantity:</p>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={handleDecrease}
          >
            -
          </button>
          <span className="px-4 py-1 text-gray-800">{quantity}</span>
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      </div>

      {/* Coupon */}
      <div className="mb-6">
        <p className="text-gray-700">Apply Coupon:</p>
        <input
          type="text"
          className="w-full mt-2 px-4 py-2 border rounded-lg"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button
          className="w-full mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
          onClick={handleApplyCoupon}
        >
          Apply
        </button>
      </div>

      {/* Buttons */}
      <button className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700">
        Buy Now
      </button>
      <button className="w-full mt-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300">
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
