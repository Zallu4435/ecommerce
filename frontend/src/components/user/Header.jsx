import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineCompare } from "react-icons/md";
import { logoLight, logoDark, defaultProfile } from "../../assets/images/index";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../redux/apiSliceFeatures/userApiSlice";
import { useSearchProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import { useGetCartQuery } from "../../redux/apiSliceFeatures/CartApiSlice";
import { useGetWishlistQuery } from "../../redux/apiSliceFeatures/WishlistApiSlice";
import { useGetComparisonListQuery } from "../../redux/apiSliceFeatures/ComparisonApiSlice";
import debounce from "lodash/debounce";
import LoadingSpinner from "../LoadingSpinner";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const avatar = useSelector((state) => state.user.avatar);
  const username = useSelector((state) => state.user.username);
  // Live user info from RTK Query; invalidated by profile updates
  const { data: userData } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const { data: searchResults, isLoading } = useSearchProductsQuery(
    debouncedSearchTerm,
    {
      skip: debouncedSearchTerm.length < 3,
    }
  );

  // Fetch cart, wishlist, and comparison data only if authenticated
  const { data: cartData = [] } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const { data: wishlistData = [] } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const { data: comparisonData = [] } = useGetComparisonListQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Calculate counts
  const cartCount = cartData?.length || 0;
  const wishlistCount = wishlistData?.length || 0;
  const comparisonCount = comparisonData?.length || 0;

  const resolvedAvatar = userData?.user?.avatar || avatar || defaultProfile;
  const resolvedUsername = userData?.user?.username || username;

  const links = [
    isAuthenticated
      ? {
          to: "/profile",
          Icon: null,
          avatar: resolvedAvatar,
          label: resolvedUsername ? resolvedUsername : "Profile",
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
  ]

  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (searchTerm === "") {
      setDebouncedSearchTerm("");
    }
  }, [searchTerm]);

  useEffect(() => {
    if (location.pathname === "/shop") {
      const queryParams = new URLSearchParams();
      if (debouncedSearchTerm) {
        queryParams.set("q", debouncedSearchTerm);
      } else {
        queryParams.delete("q");
      }
      navigate(`/shop?${queryParams.toString()}`, { replace: true });
    }
  }, [debouncedSearchTerm, navigate, location.pathname]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSearch(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setShowSearch(false);
    navigate("/shop");
  };

  const handleOutsideClick = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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

  const isShopPage = location.pathname === "/shop";

  return (
    <header className="dark:bg-gray-800 bg-gray-100 py-4 z-50 shadow-md">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="block">
            <img
              src={logoLight}
              alt="Light Mode Logo"
              className="h-[60px] my-[-20px] sm:h-12 md:h-14 lg:h-[100px] object-contain dark:hidden"
            />
            <img
              src={logoDark}
              alt="Dark Mode Logo"
              className="h-[60px] my-[-20px] sm:h-12 md:h-14 lg:h-[100px] object-contain hidden dark:block"
            />
          </Link>
        </div>

        {isShopPage && (
          <div
            className="flex-grow max-w-xl mx-4 z-50 hidden md:block"
            ref={searchRef}
          >
            <form className="relative">
              <input
                type="text"
                placeholder="Search For Products"
                className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 transition-all duration-300 dark:bg-gray-700 dark:text-gray-200"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              )}
              <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
              {isLoading && <LoadingSpinner />}
            </form>
            {showSearch && debouncedSearchTerm && (
              <div className="absolute z-10 w-[555px] mt-2 bg-white dark:bg-gray-700 rounded-md ml-[10px] shadow-lg">
                {isLoading ? (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-300">Searching...</div>
                ) : searchResults && searchResults.length > 0 ? (
                  <>
                    {searchResults.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setShowSearch(false)}
                      >
                        {product.productName}
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <Link
                        to={`/shop?q=${encodeURIComponent(searchTerm)}`}
                        className="block px-4 py-2 text-center text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setShowSearch(false)}
                      >
                        View all results
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-300">No products found.</div>
                )}
              </div>
            )}
          </div>
        )}

        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="flex flex-col items-center group p-2 sm:p-3 relative"
            >
              <div className="relative">
                {link.Icon ? (
                  <>
                    <link.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300" />
                    {link.count !== null && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {link.count > 99 ? '99+' : link.count}
                      </span>
                    )}
                  </>
                ) : link.avatar ? (
                  <img
                    src={link.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultProfile;
                    }}
                  />
                ) : null}
              </div>
              <span className="hidden sm:block text-xs text-gray-700 dark:text-gray-200 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300 mt-1">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
