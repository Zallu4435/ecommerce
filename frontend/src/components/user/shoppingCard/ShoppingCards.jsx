import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa';
import { roundedImg_1 } from '../../../assets/images';
import { useAddToCartMutation, useGetCartQuery } from '../../../redux/apiSliceFeatures/CartApiSlice';
import { useAddToWishlistMutation, useGetWishlistQuery } from '../../../redux/apiSliceFeatures/WishlistApiSlice';
import { useAddToComparisonMutation, useGetComparisonListQuery } from '../../../redux/apiSliceFeatures/ComparisonApiSlice';
import { icons } from './icons';
import { handleAddToCart } from './actionHandlers';
import { DUMMY_RATING, DUMMY_REVIEWS } from './constants';

const ShoppingCard = ({
  _id,
  productName,
  originalPrice,
  price, 
  image,
}) => {
  const formattedPrice = parseFloat(price);
  const formattedOriginalPrice = parseFloat(originalPrice);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // console.log(formattedPrice, "offerPrice")

  const navigate = useNavigate();
  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const { refetch: refetchWishlist } = useGetWishlistQuery();
  const [addToComparison] = useAddToComparisonMutation();
  const { refetch: refetchComparison } = useGetComparisonListQuery();

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  const handleImageClick = () => navigate(`/product/${_id}`);

  return (
    <div className="m-3 border rounded-lg text-lg shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.1)] overflow-hidden w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[420px] p-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="relative flex justify-center py-6 px-12 sm:py-8 items-center bg-gray-100 dark:bg-gray-700">
        <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] overflow:hidden">
          <img
            src={image}
            alt="Hover Test"
            className="w-full absolute z-10 h-full object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={handleImageClick}
          />
          
        </div>

        <div className="absolute top-2 left-0 right-0 bottom-0 flex justify-between p-2 mt-2">
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <div className="bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              -29%
            </div>
            <div className="bg-white dark:bg-gray-600 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              HOT
            </div>
          </div>

          <div className="relative group">
            <div
              onClick={handleDropdownToggle}
              className={`bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-2xl sm:text-4xl ${
                showDropdown ? "rounded-t-full sm:pt-4" : "rounded-full sm:pt-1"
              } w-12 h-12 sm:w-[60px] sm:h-16 flex items-center pb-1 sm:pb-4  justify-center cursor-pointer`}
            >
              {showDropdown ? (
                <FaTimes
                  className={`text-xl sm:text-2xl md:text-4xl md:p-1 dark:bg-gray-600 bg-gray-200 p-1 rounded-full sm:p-2 shadow-lg`}
                />
              ) : (
                "+"
              )}
            </div>

            {showDropdown && (
              <div className="absolute top-14 left-0 space-y-2 sm:space-y-4 bg-white dark:bg-gray-600 p-1 sm:p-2 rounded-b-full shadow-lg">
                {icons.map(({ Icon, color, action }, index) => (
                  <div
                    key={index}
                    onClick={() => action(_id, { addToWishlist, refetchWishlist, addToComparison, refetchComparison })}
                    className="bg-gray-200 dark:bg-gray-700 p-2 sm:p-3 rounded-full cursor-pointer"
                  >
                    <Icon className={`${color} text-sm sm:text-xl`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold">{productName}</h3>

        <div className="flex mt-2">
          {Array(5)
            .fill(<FaStar className="text-yellow-400" />)
            .map((star, index) => (
              <span key={index}>{star}</span>
            ))}
        </div>

        <div className="flex space-x-3 sm:space-x-5 text-gray-700 dark:text-gray-300">
          <p className="text-sm sm:text-base">Rating: {DUMMY_RATING}</p>
          <p className="text-sm sm:text-base">{DUMMY_REVIEWS} reviews</p>
        </div>

        <div className="inline-flex items-center space-x-2">
          <span className="text-gray-500 line-through text-sm sm:text-base">
            &#8377;{formattedPrice.toFixed(2)}
          </span>
          <span className="text-red-500 font-semibold text-sm sm:text-base">
          &#8377;{formattedOriginalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => handleAddToCart(_id, addToCart, refetchCart, setIsAdding)}
          disabled={isAdding}
          className={`w-full py-2 sm:py-3 flex justify-center items-center gap-2 rounded-full border font-semibold text-base sm:text-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition ${
            isAdding
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-yellow-500 dark:hover:bg-yellow-600"
          }`}
        >
          {isAdding ? "Adding to Cart..." : "Add to Cart"}
          {!isAdding && <FaShoppingCart />}
        </button> 
      </div>
    </div>
  );
};

export default ShoppingCard;

