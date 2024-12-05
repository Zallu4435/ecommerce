import React, { useState, useEffect } from 'react';

// Define the related products array with additional products
const relatedProducts = [
  {
    name: 'Product 1',
    price: 99.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.5,
  },
  {
    name: 'Product 2',
    price: 129.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.2,
  },
  {
    name: 'Product 3',
    price: 89.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.7,
  },
  {
    name: 'Product 4',
    price: 149.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.0,
  },
  {
    name: 'Product 5',
    price: 109.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.3,
  },
  {
    name: 'Product 6',
    price: 179.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.8,
  },
  {
    name: 'Product 7',
    price: 79.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.4,
  },
  {
    name: 'Product 8',
    price: 139.99,
    image: 'https://via.placeholder.com/400',
    rating: 4.6,
  },
];

const RelatedProduct = () => {
  // State to manage the current index of products displayed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);

  // Function to update the products per page based on the window width
  const updateProductsPerPage = () => {
    if (window.innerWidth >= 1240) {
        setProductsPerPage(7)
    } else if (window.innerWidth >= 1024) {
      setProductsPerPage(5); // 5 products per page for large screens
    } else if (window.innerWidth >= 768) {
      setProductsPerPage(4); // 4 products per page for medium screens
    } else {
      setProductsPerPage(3); // 3 products per page for small screens
    }
  };

  // Call updateProductsPerPage on initial render and when the window is resized
  useEffect(() => {
    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => {
      window.removeEventListener('resize', updateProductsPerPage);
    };
  }, []);

  // Function to handle the next slide
  const nextSlide = () => {
    if (currentIndex + productsPerPage < relatedProducts.length) {
      setCurrentIndex(currentIndex + productsPerPage);
    }
  };

  // Function to handle the previous slide
  const prevSlide = () => {
    if (currentIndex - productsPerPage >= 0) {
      setCurrentIndex(currentIndex - productsPerPage);
    }
  };

  return (
    <div className="relative mt-12 mx-5 lg:mx-12">
                    {/* Navigation Buttons */}
        <div className="flex justify-between mt-4 absolute top-[-20px] right-0 space-x-6 ">
            <button
                onClick={prevSlide}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={currentIndex === 0}
            >
                Previous
            </button>
            <button
                onClick={nextSlide}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={currentIndex + productsPerPage >= relatedProducts.length}
            >
                Next
            </button>
        </div>
            
        <h2 className="text-3xl font-semibold mb-6">Related Products</h2>
        <div className="relative">
            {/* Product container */}
            <div className="flex overflow-x-auto gap-8 pb-4">
            {relatedProducts
                .slice(currentIndex, currentIndex + productsPerPage)
                .map((product, index) => (
                <div
                    key={index}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 ease-in-out"
                >
                    {/* Product Image */}
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    />

                    {/* Product Info */}
                    <div className="p-4 flex flex-col justify-between">
                    <h3 className="text-lg font-medium truncate">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center mt-2">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span>{product.rating}</span>
                    </div>

                    {/* Price */}
                    <p className="text-xl font-semibold text-gray-900 mt-2">${product.price}</p>

                    {/* Add to Cart Button */}
                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                        Add to Cart
                    </button>
                    </div>
                </div>
                ))}
            </div>

        </div>
    </div>
  );
};

export default RelatedProduct;
