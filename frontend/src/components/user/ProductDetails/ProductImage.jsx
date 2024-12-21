import React, { useState } from 'react';
import Magnifier from 'react-magnifier';

const ProductImage = ({ image, variantImages }) => {
  const [mainImage, setMainImage] = useState(image); // Main image state
  const [variants, setVariants] = useState(variantImages || []); // Variant images state

  console.log(mainImage, "Current Main Image");
  console.log(variants, "Variant Images");

  // Handle image swap
  const handleImageSwap = (index) => {
    const newMainImage = variants[index]; // Get the clicked variant image
    const updatedVariants = [...variants];
    updatedVariants[index] = mainImage; // Replace the clicked image with the current main image

    setMainImage(newMainImage); // Set the clicked image as the new main image
    setVariants(updatedVariants); // Update variant images
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      {/* Main Product Image with Magnifier */}
      <div className="relative">
        <Magnifier
          src={mainImage || "https://via.placeholder.com/500x500"}
          alt="Main Product"
          className="px-[150px] py-[30px] h-[350px] object-cover rounded-lg duration-300"
          mgShape="circle" // Circle magnifier
          mgShowOverflow={false}
          mgWidth={150}
          mgHeight={150}
          zoomFactor={1.5}
        />
        <span className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
          New Arrival
        </span>
      </div>

      {/* Variant Images Gallery */}
      <div className="flex gap-4 mt-4 justify-center">
        {variants && variants.length > 0 ? (
          variants.map((image, index) => (
            <div key={index} className="text-center">
              <img
                src={image || "https://via.placeholder.com/80"}
                alt={`Variant ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border hover:shadow-md cursor-pointer"
                onClick={() => handleImageSwap(index)} // Swap on click
              />
              <p className="text-gray-500 dark:text-gray-300 text-xs mt-1">
                Variant {index + 1}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            No variant images available
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
