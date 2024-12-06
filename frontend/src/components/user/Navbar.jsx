import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { SiPlatformdotsh } from 'react-icons/si';
import { ThemeSwitcherButton } from '../../context/SettingsTheme';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrolled = useSelector((state) => state.scroll.scrolled);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`${scrolled ? 'fixed top-0 left-0 right-0' : 'relative'} bg-gray-800 dark:bg-gray-50 dark:text-gray-900 text-white p-4 pb-0 md:p-6 flex flex-col md:flex-row md:items-center z-40 `}>
      <div className="flex items-center justify-between w-full md:hidden mb-4 md:mb-0">
        {/* Hamburger Menu */}
        <button
          className="text-white dark:text-gray-900 text-2xl focus:outline-none"
          onClick={handleMenuToggle}
        >
          ☰
        </button>

        {/* Theme Switcher */}
        <div className="ml-4">
          <ThemeSwitcherButton />
        </div>
      </div>

      {/* Mobile Categories Dropdown */}
      {menuOpen && (
        <div className="w-full bg-gray-800 dark:bg-gray-50 flex flex-col items-center mt-4">
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-white dark:text-gray-900 focus:outline-none flex items-center text-sm gap-1 font-bold"
              onClick={handleDropdownToggle}
            >
              <SiPlatformdotsh />
              Categories
              <IoIosArrowDown />
            </button>
            {showDropdown && (
              <div className="absolute z-10 top-full left-0 mt-2 w-40 bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 p-3 rounded-lg shadow-xl">
                <Link
                  to="/mens"
                  className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
                >
                  Mens
                </Link>
                <Link
                  to="/womens"
                  className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
                >
                  Womens
                </Link>
                <Link
                  to="/childrens"
                  className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
                >
                  Childrens
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className={`w-full ${menuOpen ? 'block' : 'hidden'} md:flex md:items-center md:justify-between`}>
        {/* Categories Dropdown (Visible only on desktop) */}
        <div className="relative hidden md:flex items-center md:ml-4" ref={dropdownRef}>
          <button
            className="text-white dark:text-gray-900 focus:outline-none flex items-center text-xl gap-2 font-bold mx-4 md:mx-0"
            onClick={handleDropdownToggle}
          >
            <SiPlatformdotsh />
            All Categories
            <IoIosArrowDown />
          </button>
          {showDropdown && (
            <div className="absolute z-10 top-full left-0 md:left-auto md:right-0 mt-2 w-52 bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 p-3 rounded-lg shadow-xl">
              <Link
                to="/mens"
                className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
              >
                Mens
              </Link>
              <Link
                to="/womens"
                className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
              >
                Womens
              </Link>
              <Link
                to="/childrens"
                className="block px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
              >
                Childrens
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full lg:ml-16 md:w-auto md:ml-4 md:mb-0 space-y-4 mb-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-yellow-500 dark:hover:text-yellow-600">
            Home
          </Link>
          <Link to="/shop" className="hover:text-yellow-500 dark:hover:text-yellow-600">
            Shop
          </Link>
          <Link to="/about" className="hover:text-yellow-500 dark:hover:text-yellow-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-500 dark:hover:text-yellow-600">
            Contact Us
          </Link>
        </div>

        {/* Theme Switcher */}
        <div className="hidden md:flex justify-end md:ml-auto md:mr-4 mt-4 md:mt-0">
          <ThemeSwitcherButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
