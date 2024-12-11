import { useState } from 'react';

const AddToCart = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M'); // Default size is Medium
  const [selectedColor, setSelectedColor] = useState('Red'); // Default color is Red

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


  return (
    <div className="p-6 bg-blue-50 grid dark:bg-gray-700 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Details</h2>

      {/* Price */}
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">Price: $199.99</p>
      <p className="text-sm text-green-600 mb-4">In Stock</p>
   
      <div className='grid md:grid-cols-2 lg:grid-cols-1'>
        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300">Quantity:</p>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="px-4 py-1 text-gray-800 dark:text-gray-100">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>

        <div className='flex space-x-10 md:mt-[-80px] lg:mt-0'>
          {/* Size Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>

          {/* Color Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Color:</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Black">Black</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <button className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-500">
        Buy Now
      </button>
      <button className="w-full mt-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 dark:text-gray-100 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500">
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
