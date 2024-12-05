import React from "react";
import { FaShoppingCart, FaStar, FaRegHeart, FaExchangeAlt, FaEye, FaTimes } from "react-icons/fa";
import { roundedImg_1 } from "../../assets/images";

const ShoppingCard = ({ name = "Default Product", price = 40, originalPrice = 499, image }) => {
  const formattedPrice = parseFloat(price);
  const formattedOriginalPrice = parseFloat(originalPrice);

  const icons = [
    { Icon: FaTimes, color: 'text-gray-500' }, // Cross icon
    { Icon: FaRegHeart, color: 'text-red-500' },
    { Icon: FaExchangeAlt, color: 'text-blue-500' },
    { Icon: FaEye, color: 'text-green-500' },
  ];

  return (
    <div className="m-3 bg-orange-50 border rounded-lg text-lg shadow-md overflow-hidden w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[420px] p-4 border-gray-700">
      <div className="relative flex justify-center py-6 px-12 sm:py-8 items-center bg-slate-500">
        <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]">
          <img
            src={image || roundedImg_1}
            alt={name}
            className="w-full h-full object-cover transform hover:scale-105 cursor-pointer"
          />
        </div>

        <div className="absolute top-2 left-0 right-0 bottom-0 flex justify-between p-2 mt-2">
          {/* Left side boxes */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              -29%
            </div>
            <div className="bg-blue-500 text-xs sm:text-sm font-semibold text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              HOT
            </div>
          </div>

          {/* Right side box */}
          <div className="relative group">
            {/* Main button with + sign */}
            <div className="bg-blue-500 text-white text-2xl sm:text-4xl rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center pb-1 sm:pb-2 justify-center cursor-pointer">+</div>

            {/* Hidden div appearing on hover */}
            <div className="absolute top-0 left-0 group-hover:block hidden space-y-2 sm:space-y-4 bg-white p-1 sm:p-2 rounded-full shadow-lg">
              {icons.map(({ Icon, color }, index) => (
                <div key={index} className="bg-gray-200 p-2 sm:p-3 rounded-full cursor-pointer">
                  <Icon className={`${color} text-sm sm:text-xl`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold">{name}</h3>

        {/* Display rating stars */}
        <div className="flex mt-2">
          {Array(5)
            .fill(<FaStar className="text-yellow-400" />)
            .map((star, index) => (
              <span key={index}>{star}</span>
            ))}
        </div>

        {/* Rating text mirrored from the stars */}
        <div className="flex space-x-3 sm:space-x-5 text-gray-700">
          <p className="text-sm sm:text-base">Rating: 4.5 / 5</p> {/* Dummy rating */}
          <p className="text-sm sm:text-base">200 reviews</p> {/* Dummy reviews */}
        </div>

        {/* Display original price and offer price */}
        <div className="inline-flex text-white items-center space-x-2">
          {/* Striked original price */}
          <span className="text-gray-500 line-through text-sm sm:text-base">
            ${formattedOriginalPrice.toFixed(2)}
          </span>
          {/* Offer price */}
          <span className="text-red-500 font-semibold text-sm sm:text-base">
            ${formattedPrice.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-2 sm:py-3 flex justify-center items-center gap-2 rounded-full border border-gray-700 font-semibold text-base sm:text-lg transition">
          Add to Cart
          <FaShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ShoppingCard;




import { useState, useEffect } from 'react';

export const CardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8); // Default for extra-large screens

  const cards = Array.from({ length: 12 }, (_, index) => ({
    name: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
    originalPrice: Math.floor(Math.random() * 150) + 100,
    image: roundedImg_1, // Use a placeholder image
  }));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerPage(8);
      } else if (window.innerWidth >= 1024) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerPage(4);
      } else {
        setCardsPerPage(4);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize); // Listen for resize events

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Calculate the indices of the cards to display on the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {cards.slice(startIndex, endIndex).map((card, index) => (
          <ShoppingCard key={index} {...card} />
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

