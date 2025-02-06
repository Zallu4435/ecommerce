import { useState, useEffect } from "react";
import ShoppingCard from "./shoppingCard/ShoppingCards";
import { useGetPopularProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

export const CardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);

  const {
    data: popular_Products = [],
    error,
    isLoading,
  } = useGetPopularProductsQuery(); 

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

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(popular_Products.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading products!</div>;

  return (
    <div className="flex flex-col items-center shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.1)] p-6 rounded-lg space-y-6 overflow-x-hidden">
      {/* Grid container for products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {popular_Products.slice(startIndex, endIndex).map((products, index) => (
          <ShoppingCard key={index} {...products} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {currentPage} / {totalPages}
        </span>
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
