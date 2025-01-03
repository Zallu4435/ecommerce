import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { SiPlatformdotsh } from "react-icons/si";
import { ThemeSwitcherButton } from "../../context/SettingsTheme";
import { useSelector } from "react-redux";
import { FaMale, FaFemale, FaChild } from "react-icons/fa"; // Importing icons


const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const scrolled = useSelector((state) => state.root.scroll.scrolled);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when navigating to a new page
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const categories = [
    { path: "/shop?category=men", label: "Mens", icon: <FaMale /> },
    { path: "/shop?category=women", label: "Womens", icon: <FaFemale /> },
    { path: "/shop?category=child", label: "Childrens", icon: <FaChild /> },
  ];
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact Us" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.toLowerCase()}`);
    setShowDropdown(false);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`${
        scrolled ? "fixed top-0 left-0 right-0" : "relative"
      } bg-gray-800 dark:bg-gray-50 dark:text-gray-900 text-white p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between z-40`}
    >
      <div className="flex items-center justify-between w-full md:hidden mb-4">
        {/* Hamburger Menu */}
        <button
          className="focus:outline-none text-2xl"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          {/* Light Mode Icon */}
          <svg
            className="block dark:hidden w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>

          {/* Dark Mode Icon */}
          <svg
            className="hidden dark:block w-6 h-6 text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Theme Switcher */}
        <div className="ml-4">
          <ThemeSwitcherButton />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`${
          menuOpen ? "block" : "hidden"
        } md:flex md:items-center md:flex-grow`}
      >
        {/* Categories Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="text-white dark:text-gray-900 focus:outline-none flex items-center text-sm gap-1 font-bold mb-4 md:mb-0 md:mr-6"
            onClick={handleDropdownToggle}
          >
            <SiPlatformdotsh />
            Categories
            <IoIosArrowDown />
          </button>

          {showDropdown && (
            <div className="absolute z-10 top-full left-0 md:left-auto mt-2 w-40 md:w-52 bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 p-3 rounded-lg shadow-xl">
              {categories.map((category) => (
          <button
          key={category.path}
          onClick={() => handleCategoryClick(category.label)}
          className="w-full flex items-center text-xs md:text-lg text-left px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition duration-200 ease-in-out dark:text-gray-100"
        >
          {category.icon} {/* Displaying the icon */}
          <span className="ml-2">{category.label}</span> {/* Adding margin between icon and text */}
        </button>
        
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-yellow-500 dark:hover:text-yellow-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Theme Switcher */}
      <div className="hidden md:block md:ml-6">
        <ThemeSwitcherButton />
      </div>
    </nav>
  );
};

export default Navbar;

