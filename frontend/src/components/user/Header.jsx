import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa6';
import { MdOutlineCompare } from 'react-icons/md';
import { logo } from '../../assets/images';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const links = [
    { to: '/profile', Icon: FaUser, label: 'Profile' },
    { to: '/wishlist', Icon: FaHeart, label: 'Wishlist' },
    { to: '/compare', Icon: MdOutlineCompare, label: 'Compare' },
    { to: '/cart', Icon: FaShoppingCart, label: 'Cart' },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="block">
            <img
              src={logo}
              alt="Logo"
              className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search For Products"
              className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
            />
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="flex flex-col items-center group p-2 sm:p-3"
            >
              <link.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-yellow-500 transition-colors duration-300" />
              <span className="hidden sm:block text-xs text-gray-600 group-hover:text-yellow-500 transition-colors duration-300 mt-1">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Search Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-yellow-500 transition-colors duration-300"
          onClick={() => setShowSearch(!showSearch)}
        >
          <IoIosSearch className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-6 py-4 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search For Products"
              className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
            />
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
