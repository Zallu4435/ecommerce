import React from 'react';

const ProductImage = ({ image }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <div className="relative">
        <img
          src="https://via.placeholder.com/500x500"
          alt="Main Product"
          className="w-full h-96 object-cover rounded-lg transform hover:scale-110 transition duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
          New Arrival
        </span>
      </div>

      {/* Gallery */}
      <div className="flex gap-4 mt-4 justify-center">
        {['80', '80', '80'].map((size, index) => (
          <div key={index} className="text-center">
            <img
              src={image || `https://via.placeholder.com/${size}`}
              alt={`Gallery ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border hover:shadow-md cursor-pointer"
            />
            <p className="text-gray-500 dark:text-gray-300 text-xs mt-1">Angle {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
