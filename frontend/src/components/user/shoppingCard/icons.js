import { FaRegHeart, FaExchangeAlt, FaEye } from "react-icons/fa";
import { handleAddToWishlist, handleAddToComparison, handleViewProduct } from './actionHandlers';

export const icons = [
  {
    Icon: FaRegHeart,
    color: "text-red-500 dark:text-red-400",
    action: handleAddToWishlist,
  },
  {
    Icon: FaExchangeAlt,
    color: "text-blue-500 dark:text-blue-300",
    action: handleAddToComparison,
  },
  {
    Icon: FaEye,
    color: "text-green-500 dark:text-green-300",
    action: handleViewProduct,
  },
];

