import { useState } from 'react';
import { useAddToCartMutation, useGetCartQuery } from '../../../redux/apiSliceFeatures/CartApiSlice';
import { toast } from 'react-toastify';

const AddToCart = ({ productId, colorOption, sizeOption }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [selectedSize, setSelectedSize] = useState(sizeOption[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colorOption[0] || 'Red');  
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [message, setMessage] = useState(''); // To display success/error message
  const { refetch: refetchCart } = useGetCartQuery(); // Refetch cart data


  const [addToCart] = useAddToCartMutation();

  const MAX_QUANTITY = 7; // Maximum quantity limit

  // console.log(colorOption, sizeOption, "color ans size ")

  // Handle increase in quantity, ensuring it doesn't exceed MAX_QUANTITY
  const handleIncrease = () => {
    if (quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Handle decrease in quantity, ensuring it doesn't go below 1
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle adding the item to the cart
  const handleAddToCart = async () => {
    const productDetails = {
      productId,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };

    // Start loading state
    setIsLoading(true);
    setMessage('');

    try {
      // Call the dummy API to simulate adding to cart
      const response = await addToCart(productDetails);
      await refetchCart();
      setMessage(response.message); // Show success message
    } catch (error) {
      toast(error.message);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="p-6 bg-blue-50 grid dark:bg-gray-700 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Details</h2>

      {/* Price */}
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">Price: $199.99</p>
      <p className="text-sm text-green-600 mb-4">In Stock</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-1">
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
              disabled={quantity >= MAX_QUANTITY} // Disable the button if quantity reaches MAX_QUANTITY
            >
              +
            </button>
          </div>
        </div>

        <div className="flex space-x-10 md:mt-[-80px] lg:mt-0">
          {/* Size Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {sizeOption.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
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
              {colorOption.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading indicator or message */}
      {isLoading ? (
        <p className="text-gray-700 dark:text-gray-300">Adding to cart...</p>
      ) : (
        message && <p className="text-green-600 dark:text-green-400">{message}</p>
      )}

      {/* Buttons */}
      <button
        className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-500"
        onClick={handleAddToCart}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? 'Loading...' : 'Buy Now'}
      </button>
      <button
        className="w-full mt-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 dark:text-gray-100 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500"
        onClick={handleAddToCart}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? 'Loading...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCart;
