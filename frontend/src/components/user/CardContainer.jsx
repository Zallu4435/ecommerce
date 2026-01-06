import { useState, useEffect } from "react";
import ShoppingCard from "./shoppingCard/ShoppingCards";
import { useGetPopularProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);

  const {
    data: popular_Products = [],
    error,
    isLoading,
  } = useGetPopularProductsQuery();

  useEffect(() => {
    // Optimized resize handler with debounce logic could be added here, 
    // but sticking to simple breakpoint logic for now.
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl
        setCardsPerPage(8);
      } else if (window.innerWidth >= 1024) { // lg
        setCardsPerPage(8);
      } else if (window.innerWidth >= 768) { // md
        setCardsPerPage(6); // 3x2 grid logic usually works well here
      } else {
        setCardsPerPage(4);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil((popular_Products?.length || 0) / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentProducts = popular_Products?.slice(startIndex, endIndex) || [];

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: Scroll to top of section smoothly
      // document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <p>Failed to load popular products. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div id="popular-products" className="w-full relative">
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
            {currentProducts.map((product) => (
              <ShoppingCard key={product._id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No popular products found at the moment.</p>
          </div>
        )}

        {/* Modern Pagination */}
        {popular_Products.length > cardsPerPage && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="group p-3 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-black hover:border-black dark:hover:bg-white dark:hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Page</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[1.5rem] text-center">
                {currentPage}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">of {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="group p-3 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-black hover:border-black dark:hover:bg-white dark:hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardContainer;
