import React, { useState } from 'react';
import Magnifier from 'react-magnifier';

const ProductImage = ({ image, variantImages }) => {
  const [mainImage, setMainImage] = useState(image);
  const [variants, setVariants] = useState(variantImages || []);

  console.log(mainImage, "Current Main Image");
  console.log(variants, "Variant Images");

  const handleImageSwap = (index) => {
    const newMainImage = variants[index];
    const updatedVariants = [...variants];
    updatedVariants[index] = mainImage;

    setMainImage(newMainImage);
    setVariants(updatedVariants);
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-40 py-4 sm:py-6 md:py-8 lg:py-[30px] bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      {/* Main Product Image with Magnifier */}
      <div className="relative">
        <Magnifier
          src={mainImage || "https://via.placeholder.com/500x500"}
          alt="Main Product"
          className="w-full h-auto object-cover my-2 sm:my-4 md:my-6 rounded-lg duration-300"
          mgShape="circle"
          mgShowOverflow={false}
          mgWidth={100}
          mgHeight={100}
          zoomFactor={1.5}
        />
        {/* <span className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
          New Arrival
        </span> */}
      </div>

      {/* Variant Images Gallery */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4 justify-center">
        {variants && variants.length > 0 ? (
          variants.map((image, index) => (
            <div key={index} className="text-center">
              <img
                src={image || "https://via.placeholder.com/80"}
                alt={`Variant ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border hover:shadow-md cursor-pointer"
                onClick={() => handleImageSwap(index)}
              />
              <p className="text-gray-500 dark:text-gray-300 text-xs mt-1 hidden sm:block">
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

