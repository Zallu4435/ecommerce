import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingCard from "../../components/user/shoppingCard/ShoppingCards";
import {
  useGetFilteredProductsQuery,
  useSearchProductsQuery,
} from "../../redux/apiSliceFeatures/productApiSlice";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Menu } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(9);
  const [sortOption, setSortOption] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [location.search]);

  const {
    data: filteredData,
    error: filteredError,
    isLoading: isFilteredLoading,
  } = useGetFilteredProductsQuery(
    {
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortOption,
      page: currentPage,
      limit: cardsPerPage,
      category: category,
    },
    { skip: !!searchQuery }
  );

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useSearchProductsQuery(searchQuery, { skip: !searchQuery });

  const dataList = searchQuery
    ? searchData
    : filteredData?.products
    ? filteredData?.products
    : [];

  const totalPages = searchQuery
    ? Math.ceil((searchData?.totalItems || 0) / cardsPerPage)
    : filteredData?.totalPages || 1;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSizes,
    selectedColors,
    priceRange,
    sortOption,
    category,
    searchQuery,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const toggleSelection = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate({
      pathname: location.pathname,
      search: category ? `category=${category}` : "",
    });
  };

  const isLoading = isFilteredLoading || isSearchLoading;
  const error = filteredError || searchError;

  return (
    <div className="min-h-screen dark:bg-gray-900 py-16">
      <div className="flex space-x-4 pl-4 pt-3 lg:hidden lg:ml-20 sticky top-[80px] z-50 lg:mb-10 mt-[-40px]">
        {isSmallScreen && (
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}
        <button onClick={handleClearSearch} className="text-blue-500 mb-4">
          Clear Search
        </button>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        <div
          className={`${
            isSmallScreen ? (isMobileMenuOpen ? "block" : "hidden") : "block"
          } w-full lg:w-[300px] lg:sticky lg:top-16 lg:h-[calc(74vh-4rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-auto transition-all duration-300 ease-in-out`}
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">
              Size
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <label key={size} className="flex items-center dark:text-white">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedSizes.includes(size)}
                    onChange={() =>
                      toggleSelection(selectedSizes, setSelectedSizes, size)
                    }
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">
              Color
            </h3>
            <div className="grid grid-cols-2 gap-4 dark:text-white">
              {["white", "red", "blue", "black"].map((color) => (
                <label key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedColors.includes(color)}
                    onChange={() =>
                      toggleSelection(selectedColors, setSelectedColors, color)
                    }
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">
              Price Range
            </h3>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="mt-2 text-sm dark:text-white text-gray-600">
              &#8377;{priceRange[0]} - &#8377;{priceRange[1]}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">
              Sort By
            </h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">Popularity</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="averageRatings">Average Ratings</option>
              <option value="featured">Featured</option>
              <option value="newArrivals">New Arrivals</option>
              <option value="aToZ">A-Z</option>
              <option value="zToA">Z-A</option>
            </select>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          {searchQuery && (
            <h2 className="text-2xl font-bold mb-4">
              Search Results for "{searchQuery}"
            </h2>
          )}
          <ErrorBoundary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[80px]">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <p className="text-red-500">
                  Error loading products: {error.message || "Unknown error"}
                </p>
              ) : dataList && dataList.length > 0 ? (
                dataList.map((product) => (
                  <ShoppingCard
                    key={product._id || Math.random()}
                    _id={product._id || ""}
                    productName={product.productName || "Unnamed Product"}
                    originalPrice={product.originalPrice || 0}
                    offerPrice={product.offerPrice || 0}
                    image={product.image || "/default-image.jpg"}
                    averageRating={product.averageRating || 0}
                    totalReviews={product.totalReviews || 0}
                  />
                ))
              ) : (
                <p className="text-center text-lg text-gray-500">
                  No products available with the selected filters.
                </p>
              )}
            </div>
          </ErrorBoundary>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              {totalPages > 0 ? `${currentPage} / ${totalPages}` : "No Pages"}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
