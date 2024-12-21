import { useEffect, useState } from "react";
import ShoppingCard from "../../components/user/shoppingCard/ShoppingCards"; // Import the ShoppingCard component
import { products } from "../../products/products";

const ShopPage = () => {
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(16);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1200) { 
            setCardsPerPage(16);
        } else if (window.innerWidth >= 1024) {
            setCardsPerPage(12);
        } else if (window.innerWidth >= 768) {
            setCardsPerPage(8);
        } else {
            setCardsPerPage(6);
        }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  const totalPages = Math.ceil(products.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const handlePageChange = (newPage) => {
    if(newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage)
    }
  }

  // Filter products based on selected size, color, and price range
  const filteredProducts = products.filter(product => {
    // Filter by Size
    const isSizeMatch = selectedSize === "all" || product.sizes.includes(selectedSize);

    // Filter by Color
    const isColorMatch = selectedColor === "all" || product.colors.includes(selectedColor)

    // Filter by Price Range
    const isPriceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];

    return isSizeMatch && isColorMatch && isPriceInRange;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 py-16">
      {/* Filter Section */}
      <div className="container mx-auto text-center mb-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Shop Our Products</h1>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Size Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-lg text-gray-800 dark:text-white mb-2">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-6 py-2 border rounded-lg text-gray-700 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sizes</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>

          {/* Color Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-lg text-gray-800 dark:text-white mb-2">Color:</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-6 py-2 border rounded-lg text-gray-700 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Colors</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-lg text-gray-800 dark:text-white mb-2">Price Range:</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, e.target.value])}
              className="w-full px-2 py-2 bg-gray-200 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 text-gray-700 dark:text-white">
              Price: &#8377;{priceRange[0]} - &#8377;{priceRange[1]}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container lg:px-10 md:px-4 px-4 pr-10 md:gap-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-x-36">
        {filteredProducts.length > 0 ? (
          filteredProducts.slice(startIndex, endIndex).map((product) => (
            <ShoppingCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
            />
          ))
        ) : (
          <p className="text-center text-xl text-gray-700 dark:text-white">
            No products available with the selected filters.
          </p>
        )}
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
            previous
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

export default ShopPage;
