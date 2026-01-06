import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingCard from "../../components/user/shoppingCard/ShoppingCards";
import {
  useGetFilteredProductsQuery,
} from "../../redux/apiSliceFeatures/productApiSlice";
import {
  useGetCartQuery,
  useGetWishlistQuery,
  useGetComparisonListQuery,
} from "../../redux/apiSliceFeatures/unifiedApiSlice";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Menu, X, Filter, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9); // Fixed at 9 per request
  const [sortOption, setSortOption] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Expanded/Collapsed states for filters
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
  });

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [location.search]);

  // Initialize filters from URL on mount
  useEffect(() => {
    const sizes = searchParams.get("sizes");
    const colors = searchParams.get("colors");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    if (sizes) setSelectedSizes(sizes.split(","));
    if (colors) setSelectedColors(colors.split(","));
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 10000
      ]);
    }
    if (sort) setSortOption(sort);
  }, []); // Only run on mount

  // Track if we've initialized from URL to prevent sync loop
  const hasInitialized = useRef(false);
  useEffect(() => {
    hasInitialized.current = true;
  }, []);

  // Data Fetching - Unified Search & Filter
  const {
    data: filteredData,
    error,
    isLoading,
  } = useGetFilteredProductsQuery(
    {
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortOption,
      page: currentPage,
      limit: cardsPerPage,
      category: category === "all" ? "" : category,
      search: searchQuery, // Pass search query here
    }
  );

  const { data: cartData = [] } = useGetCartQuery();
  const { data: wishlistData = [] } = useGetWishlistQuery();
  const { data: comparisonData = [] } = useGetComparisonListQuery();

  const dataList = filteredData?.products || [];
  const totalPages = filteredData?.totalPages || 1;
  const totalItems = filteredData?.total || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSizes, selectedColors, priceRange, sortOption, category, searchQuery]);

  // Sync filters to URL (only after initial load)
  useEffect(() => {
    if (!hasInitialized.current) return; // Don't sync during initialization

    const params = new URLSearchParams(location.search);

    // Preserve category and search query
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    // Update or remove filter params
    if (selectedSizes.length > 0) {
      params.set("sizes", selectedSizes.join(","));
    } else {
      params.delete("sizes");
    }

    if (selectedColors.length > 0) {
      params.set("colors", selectedColors.join(","));
    } else {
      params.delete("colors");
    }

    if (priceRange[0] !== 0) params.set("minPrice", priceRange[0].toString());
    else params.delete("minPrice");

    if (priceRange[1] !== 10000) params.set("maxPrice", priceRange[1].toString());
    else params.delete("maxPrice");

    if (sortOption !== "popularity") params.set("sort", sortOption);
    else params.delete("sort");

    // Update URL
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedSizes, selectedColors, priceRange, sortOption]);

  const toggleSelection = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(location.search);
    if (newCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    // Perform navigation while preserving search query if desired, or clear it.
    // Usually switching category clears search, but keeping q is also valid.
    // For now, let's keep search query if present to allow "Search in Category".
    navigate({ search: params.toString() });
    setIsMobileMenuOpen(false);
  };

  const handleClearAll = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 10000]);
    setSortOption("popularity");
    setSearchQuery(""); // Also clear search
    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate({ search: params.toString() });
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["White", "Black", "Red", "Blue", "Green", "Yellow", "Pink", "Navy"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans pb-20">

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-[70px] z-30 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex justify-between items-center transition-all">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold shadow-md active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Sort
        </button>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {totalItems} items
        </span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" /> Filters
                </h2>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Category</h3>
                <div className="space-y-2">
                  {[
                    { label: "All Products", value: "all" },
                    { label: "Men", value: "Men" },
                    { label: "Women", value: "Women" },
                    { label: "Kids", value: "Child" }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${(category === cat.value || (!category && cat.value === "all"))
                        ? "bg-gray-100 dark:bg-gray-700 font-bold text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Max Price</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
                />
                <div className="mt-2 text-right font-medium text-gray-900 dark:text-white">
                  ₹{priceRange[1].toLocaleString()}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSelection(selectedSizes, setSelectedSizes, size)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${selectedSizes.includes(size)
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md scale-105"
                        : "bg-white text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleSelection(selectedColors, setSelectedColors, color)}
                      className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 relative ${selectedColors.includes(color) ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-800 scale-110" : "border-gray-200 dark:border-gray-600"
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                      aria-label={`Select color ${color}`}
                    >
                      {color.toLowerCase() === 'white' && selectedColors.includes(color) && <Check className="w-4 h-4 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                      {color.toLowerCase() !== 'white' && selectedColors.includes(color) && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar (Drawer) */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div
              className={`absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-gray-900 p-6 shadow-2xl overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold dark:text-white">Filter & Sort</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>
              {/* Mobile Filters Content - Reusing Logic */}
              <div className="space-y-8">
                {/* Categories Mobile */}
                <div>
                  <h3 className="font-bold mb-3 dark:text-white">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "All", value: "all" },
                      { label: "Men", value: "Men" },
                      { label: "Women", value: "Women" },
                      { label: "Kids", value: "Child" }
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleCategoryChange(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${(category === cat.value || (!category && cat.value === "all"))
                          ? "bg-black text-white border-black dark:bg-white dark:text-black"
                          : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price Mobile */}
                <div>
                  <h3 className="font-bold mb-3 dark:text-white">Max Price: ₹{priceRange[1].toLocaleString()}</h3>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
                  />
                </div>
                {/* Sizes Mobile */}
                <div>
                  <h3 className="font-bold mb-3 dark:text-white">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSelection(selectedSizes, setSelectedSizes, size)}
                        className={`w-12 h-12 rounded-lg border font-bold ${selectedSizes.includes(size)
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-black text-white font-bold rounded-xl mt-8 dark:bg-white dark:text-black"
                >
                  Show {totalItems} Results
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sticky Header for Sort */}
            <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                  {category ? category : 'All'} Products
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {searchQuery ? `"${searchQuery}"` : "Shop Collection"}
                  </h1>
                  {!isLoading && !error && dataList.length > 0 && (
                    <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 transform translate-y-1">
                      {totalItems} Items
                    </span>
                  )}
                </div>
                {!isLoading && !error && dataList.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Showing <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * cardsPerPage + 1}</span> - <span className="font-bold text-gray-900 dark:text-white">{Math.min(currentPage * cardsPerPage, totalItems)}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalItems}</span> results
                  </p>
                )}
              </div>

              <div className="relative group min-w-[180px]">
                {/* Custom Sort Select Stylization */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <option value="popularity">Sort by: Popularity</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="newArrivals">New Arrivals</option>
                  <option value="averageRatings">Top Rated</option>
                  <option value="aToZ">Name A-Z</option>
                  <option value="zToA">Name Z-A</option>
                </select>
              </div>
            </div>

            <ErrorBoundary>
              {isLoading ? (
                <div className="min-h-[400px] flex justify-center items-center">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="min-h-[400px] flex flex-col justify-center items-center text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</p>
                  <p className="text-gray-500 mb-6">{error?.message || "Failed to load products"}</p>
                  <button onClick={() => window.location.reload()} className="px-6 py-2 bg-black text-white rounded-full">Retry</button>
                </div>
              ) : dataList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {dataList.map((product) => (
                    <ShoppingCard
                      key={product._id || Math.random()}
                      {...product}
                      cartData={cartData}
                      wishlistData={wishlistData}
                      comparisonData={comparisonData}
                    />
                  ))}
                </div>
              ) : (
                <div className="min-h-[400px] flex flex-col justify-center items-center text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700 p-12">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                    <Filter className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                    We couldn't find any products matching your current filters. Try adjusting or clearing them.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </ErrorBoundary>

            {/* Pagination */}
            {!isLoading && !error && dataList.length > 0 && (
              <div className="mt-16 flex justify-center">
                <nav className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors dark:text-white"
                  >
                    Prev
                  </button>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
                    {currentPage}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors dark:text-white"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
