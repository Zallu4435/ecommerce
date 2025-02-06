import { FaRegHeart, FaExchangeAlt, FaEye } from "react-icons/fa";
import { handleAddToWishlist, handleAddToComparison, handleViewProduct } from './ActionHandlers';

export const icons = [
  {
    Icon: FaRegHeart,
    color: "text-red-500 dark:text-red-400",
    label: "wishlist",
    action: handleAddToWishlist,
  },
  {
    Icon: FaExchangeAlt,
    color: "text-blue-500 dark:text-blue-300",
    label: "compare",
    action: handleAddToComparison,
  },
  {
    Icon: FaEye,
    color: "text-green-500 dark:text-green-300",
    label: "view",
    action: handleViewProduct,
  },
];

export const messages = {
  wishlist: "Please log in to add items to your wishlist.",
  compare: "Log in to compare products.",
  cart: "Sign in to add this item to your cart.",
};

