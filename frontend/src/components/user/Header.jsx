import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineCompare } from "react-icons/md";
import { X, Search } from "lucide-react";
import { logoLight, logoDark, defaultProfile } from "../../assets/images/index";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../redux/apiSliceFeatures/userApiSlice";
import { useSearchProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import {
  useGetCartQuery,
  useGetWishlistQuery,
  useGetComparisonListQuery,
} from "../../redux/apiSliceFeatures/unifiedApiSlice";
import debounce from "lodash/debounce";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const avatar = useSelector((state) => state.user.avatar);
  const username = useSelector((state) => state.user.username);
  const theme = useSelector((state) => state.root.theme.theme);

  const { data: userData } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const { data: searchResults, isLoading } = useSearchProductsQuery(
    debouncedSearchTerm,
    {
      skip: debouncedSearchTerm.length < 3,
    }
  );

  const { data: cartData = [] } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: wishlistData = [] } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: comparisonData = [] } = useGetComparisonListQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartCount = cartData?.length || 0;
  const wishlistCount = wishlistData?.length || 0;
  const comparisonCount = comparisonData?.length || 0;

  const resolvedAvatar = userData?.user?.avatar || avatar || defaultProfile;
  const resolvedUsername = userData?.user?.username || username;

  const links = useMemo(() => [
    isAuthenticated
      ? {
        to: "/profile",
        Icon: null,
        avatar: resolvedAvatar,
        label: resolvedUsername || "Profile",
        count: null,
      }
      : {
        to: "/login",
        Icon: FaUser,
        avatar: null,
        label: "Profile",
        count: null,
      },
    { to: "/wishlist", Icon: FaHeart, label: "Wishlist", count: wishlistCount },
    { to: "/compare", Icon: MdOutlineCompare, label: "Compare", count: comparisonCount },
    { to: "/cart", Icon: FaShoppingCart, label: "Cart", count: cartCount },
  ], [isAuthenticated, resolvedAvatar, resolvedUsername, wishlistCount, comparisonCount, cartCount]);

  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (searchTerm === "") {
      setDebouncedSearchTerm("");
    }
  }, [searchTerm]);

  // Initialize search term from URL on mount (for persistence on refresh)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const qParam = queryParams.get("q");
    if (qParam && location.pathname === "/shop") {
      setSearchTerm(qParam);
      setDebouncedSearchTerm(qParam);
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (location.pathname === "/shop") {
      const queryParams = new URLSearchParams(location.search);
      if (debouncedSearchTerm) {
        queryParams.set("q", debouncedSearchTerm);
      } else {
        queryParams.delete("q");
      }
      navigate(`/shop?${queryParams.toString()}`, { replace: true });
    }
  }, [debouncedSearchTerm, navigate, location.pathname, location.search]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSearch(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setShowSearch(false);
    setIsMobileSearchOpen(false);
    navigate("/shop");
  };

  const handleOutsideClick = (e) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSearch(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update dropdown position when search is shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      const updatePosition = () => {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      };
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [showSearch]);

  const isShopPage = location.pathname === "/shop";

  return (
    <header className="sticky top-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-b-2 border-blue-200 dark:border-blue-900 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img
                src={theme === "dark" ? logoDark : logoLight}
                alt="Logo"
                className="h-10 sm:h-12 lg:h-16 object-contain transition-all duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          {isShopPage && (
            <div
              className="flex-grow max-w-2xl mx-6 hidden lg:block relative z-[60]"
              ref={searchRef}
            >
              <div className="relative z-[60]">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full py-3 pl-12 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm group-hover:shadow-md"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search Results Dropdown Portal */}
          {showSearch && debouncedSearchTerm && createPortal(
            <div
              ref={dropdownRef}
              className="fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto animate-fadeIn"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 9999,
              }}
            >
              {isLoading ? (
                <div className="px-6 py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  {searchResults.slice(0, 5).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="flex items-center px-6 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0 group"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // Close dropdown FIRST
                        setShowSearch(false);
                        setSearchTerm("");
                        setDebouncedSearchTerm("");
                        // Then navigate (using setTimeout to ensure state updates)
                        setTimeout(() => {
                          navigate(`/product/${product._id}`);
                        }, 0);
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-14 h-14 object-cover rounded-lg mr-4 border border-gray-200 dark:border-gray-700 group-hover:border-blue-400 transition-colors"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {product.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ₹{product.baseOfferPrice || product.basePrice}
                          </p>
                          {product.baseOfferPrice && product.baseOfferPrice < product.basePrice && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹{product.basePrice}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length > 5 && (
                    <Link
                      to={`/shop?q=${encodeURIComponent(searchTerm)}`}
                      className="block px-6 py-4 text-center text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-b-2xl"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowSearch(false);
                        setTimeout(() => {
                          navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
                        }, 0);
                      }}
                    >
                      View all {searchResults.length} results →
                    </Link>
                  )}
                </>
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found for "{debouncedSearchTerm}"
                  </p>
                </div>
              )}
            </div>,
            document.body
          )}

          {/* Mobile Search Button */}
          {isShopPage && (
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="group relative flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <div className="relative">
                  {link.Icon ? (
                    <>
                      <link.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                      {isAuthenticated && link.count !== null && link.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
                          {link.count > 99 ? '99+' : link.count}
                        </span>
                      )}
                    </>
                  ) : link.avatar ? (
                    <div className="relative">
                      <img
                        src={link.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-300 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultProfile;
                        }}
                      />
                      {isAuthenticated && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                      )}
                    </div>
                  ) : null}
                </div>
                <span className="hidden sm:block text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mt-1">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        {isShopPage && isMobileSearchOpen && (
          <div className="lg:hidden pb-4 animate-fadeIn">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-3 pl-12 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Search Results */}
              {showSearch && debouncedSearchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="px-6 py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <>
                      {searchResults.slice(0, 5).map((product) => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          onClick={() => {
                            setShowSearch(false);
                            setIsMobileSearchOpen(false);
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded-lg mr-3 border border-gray-200 dark:border-gray-700"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {product.productName}
                            </p>
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                              ₹{product.baseOfferPrice || product.basePrice}
                            </p>
                          </div>
                        </Link>
                      ))}
                      {searchResults.length > 5 && (
                        <Link
                          to={`/shop?q=${encodeURIComponent(searchTerm)}`}
                          className="block px-4 py-3 text-center text-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          onClick={() => {
                            setShowSearch(false);
                            setIsMobileSearchOpen(false);
                          }}
                        >
                          View all {searchResults.length} results →
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
