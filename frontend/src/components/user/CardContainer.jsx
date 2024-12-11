import { useState, useEffect } from 'react';
import ShoppingCard from './ShoppingCards'; // Adjust the path if necessary
import { products } from '../../products/products';

export const CardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8); // Default for extra-large screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerPage(8);
      } else if (window.innerWidth >= 1024) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerPage(4);
      } else {
        setCardsPerPage(2);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize); // Listen for resize events

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / cardsPerPage);

  // Calculate the indices of the cards to display on the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col items-center shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.1)] p-6 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {products.slice(startIndex, endIndex).map((products, index) => (
          <ShoppingCard key={index} {...products} />
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CardContainer;
