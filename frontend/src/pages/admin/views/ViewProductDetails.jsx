import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../redux/apiSliceFeatures/productApiSlice';
import Magnifier from 'react-magnifier';

const ViewProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetProductByIdQuery(id);

  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (data?.product?.image) {
      setMainImageIndex(0);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error.message || 'Something went wrong!'}
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: Product not found
      </div>
    );
  }

  const allImages = [product.image, ...product.variantImages];

  const productDetails = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Return Policy', value: product.returnPolicy },
    { label: 'Description', value: product.description },
    { label: 'Price', value: (
      <>
        <span className="line-through text-red-500 mr-2">₹{product.originalPrice}</span>{' '}
        <span className="text-green-500 font-semibold">
        ₹{ product.offerPrice }
        </span>
      </>
    )},    
    { label: 'Stock', value: `${product.stock} items available` },
    { label: 'Available Sizes', value: product.sizeOption.join(', ') },
    { label: 'Available Colors', value: product.colorOption.join(', ') },
  ];

  return (
    <div className="flex justify-center mx-12 bg-orange-50 items-center min-h-screen dark:bg-black p-4">
      <div className="container mx-auto w-[1200px] bg-orange-50 shadow-md rounded-lg p-8 dark:bg-gray-900 dark:text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Back
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full lg:w-3/4 mx-auto">
            <div className="mb-4">
              <Magnifier
                src={allImages[mainImageIndex] || 'https://via.placeholder.com/400'}
                alt={product.productName}
                className="w-full object-cover rounded-lg shadow-lg"
                mgShape="circle"
                mgShowOverflow={false}
                mgWidth={150}
                mgHeight={150}
                zoomFactor={1.5}
              />  
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(3)].map((_, index) => {
                const imageIndex = (mainImageIndex + index + 1) % allImages.length;
                return (
                  <div 
                    key={index} 
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                      imageIndex === mainImageIndex ? 'border-indigo-500' : 'border-transparent'
                    }`}
                    onClick={() => setMainImageIndex(imageIndex)}
                  >
                    <img
                      src={allImages[imageIndex]}
                      alt={`Variant ${imageIndex + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">{product.productName}</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-6">{product.description}</p>

            <ul className="space-y-4">
              {productDetails.map((detail, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300 font-medium flex justify-between">
                  <span>{detail.label}:</span> <span className="text-gray-900 dark:text-gray-100">{detail.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetails;

