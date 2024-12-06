import React from 'react';

const AddToWishlist = () => {
  const handleAddToWishlist = () => {
    alert('Added to Wishlist');
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleAddToWishlist}
        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
      >
        Add to Wishlist ❤️
      </button>
    </div>
  );
};

export default AddToWishlist;
