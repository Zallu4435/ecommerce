import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingCard from "../../components/user/shoppingCard/ShoppingCards";
import { useGetFilteredProductsQuery, useSearchProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import { ErrorBoundary } from "../../ErrorBoundary";

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");

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
    refetch,
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

  console.log(searchData, 'search')
  const products = searchQuery ? searchData : filteredData?.products;
  const totalPages = searchQuery
    ? Math.ceil((searchData?.totalItems || 0) / cardsPerPage)
    : filteredData?.totalPages || 1;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setCardsPerPage(9);
      } else if (window.innerWidth >= 1024) {
        setCardsPerPage(6);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSizes, selectedColors, priceRange, sortOption, category, searchQuery]);

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

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   navigate({
  //     pathname: location.pathname,
  //     search: query ? `q=${query}` : category ? `category=${category}` : "",
  //   });
  // };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate({
      pathname: location.pathname,
      search: category ? `category=${category}` : "",
    });
  };

  const displayedProducts = (products || []).slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const isLoading = isFilteredLoading || isSearchLoading;
  const error = filteredError || searchError;

  // useEffect(() => {
  //   console.log("Filtered Data:", filteredData);
  //   console.log("Search Data:", searchData);
  //   console.log("Products:", products);
  //   console.log("Displayed Products:", displayedProducts);
  // }, [filteredData, searchData, products, displayedProducts]);

  return (
    <div className="min-h-screen dark:bg-black bg-gradient-to-br from-gray-100 via-white to-gray-50 py-16">
      <div className="container mx-auto flex gap-6">
        <div className="w-[300px] scrollbar-hidden dark:bg-gray-800 dark:text-white sticky ml-[-20px] me-[10px] top-16 h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">Size</h3>
            <div className="grid grid-cols-3 gap-4">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <label key={size} className="flex items-center">
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
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">Color</h3>
            <div className="grid grid-cols-2 gap-4">
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
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">Price Range</h3>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, e.target.value])}
              className="w-full"
            />
            <div className="mt-2 text-sm dark:text-white text-gray-600">
              &#8377;{priceRange[0]} - &#8377;{priceRange[1]}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">Sort By</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
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
        <div className="w-3/4">
          {searchQuery && (
            <h2 className="text-2xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
          )}
          <button onClick={handleClearSearch} className="text-blue-500 mb-4">
            Clear Search
          </button>
          <ErrorBoundary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[80px]">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">Error loading products: {error.message || "Unknown error"}</p>
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
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
