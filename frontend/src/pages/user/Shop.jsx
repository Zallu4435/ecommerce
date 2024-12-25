import { useEffect, useState } from "react";
import ShoppingCard from "../../components/user/shoppingCard/ShoppingCards"; // Import the ShoppingCard component
import { useGetShopProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";

const ShopPage = () => {
  const { data, error, isLoading } = useGetShopProductsQuery();
  const products = Array.isArray(data?.products) ? data.products : [];

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("popularity");

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

  const totalPages = Math.ceil(products.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle checkbox selection
  const toggleSelection = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const isSizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) => product.sizeOption?.includes(size));
    const isColorMatch =
      selectedColors.length === 0 ||
      selectedColors.some((color) => product.colorOption?.includes(color));
    const isPriceInRange =
      product.originalPrice >= priceRange[0] &&
      product.originalPrice <= priceRange[1];
    return isSizeMatch && isColorMatch && isPriceInRange;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "popularity":
        return b.popularity - a.popularity;
      case "priceLowToHigh":
        return a.originalPrice - b.originalPrice;
      case "priceHighToLow":
        return b.originalPrice - a.originalPrice;
      case "averageRatings":
        return b.averageRating - a.averageRating;
      case "featured":
        return b.isFeatured - a.isFeatured;
      case "newArrivals":
        return new Date(b.arrivalDate) - new Date(a.arrivalDate);
      case "aToZ":
        return a.productName.localeCompare(b.productName);
      case "zToA":
        return b.productName.localeCompare(a.productName);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen dark:bg-black bg-gradient-to-br from-gray-100 via-white to-gray-50 py-16">
      <div className="container mx-auto flex gap-6">
        {/* Sidebar Filters */}
        <div className="w-[300px] scrollbar-hidden dark:bg-gray-800 dark:text-white sticky ml-[-20px] me-[10px] top-16 h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg p-6 overflow-auto">
          {/* Size Filter */}
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

          {/* Color Filter */}
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

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium dark:text-white text-gray-700 mb-4">
              Price Range
            </h3>
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

          {/* Sorting Options */}
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

        {/* Product Grid */}
        <div className="w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[80px]">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading products.</p>
            ) : sortedProducts.length > 0 ? (
              sortedProducts
                .slice(startIndex, endIndex)
                .map((product) => (
                  <ShoppingCard
                    key={product.id}
                    _id={product.id}
                    productName={product.productName}
                    price={product.originalPrice}
                    originalPrice={product.offerPrice}
                    image={product.image}
                  />
                ))
            ) : (
              <p className="text-center text-lg text-gray-500">
                No products available with the selected filters.
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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
