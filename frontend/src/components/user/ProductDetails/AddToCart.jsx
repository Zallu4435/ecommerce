import { useState, useEffect } from "react";
import {
  useAddToCartMutation,
} from "../../../redux/apiSliceFeatures/unifiedApiSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LIMITS } from "../../../utils/edgeCaseValidators";

const TAX_RATE = 0.08;
const SHIPPING_COST = 5;

const AddToCart = ({
  productId,
  availableColors,
  availableSizes,
  basePrice,
  productImage,
  baseOfferPrice,
  productName,
  totalStock,
  variants = [],
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableSizesForColor, setAvailableSizesForColor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_QUANTITY = LIMITS.CART_QUANTITY_MAX;

  const isAuthenticated = useSelector((state) => state?.user?.isAuthenticated);

  // Initialize with first available color
  useEffect(() => {
    if (availableColors && availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  // Update available sizes when color changes
  useEffect(() => {
    if (selectedColor && variants.length > 0) {
      const sizesForColor = variants
        .filter(v => v.color?.toLowerCase() === selectedColor?.toLowerCase() && v.stockQuantity > 0 && v.isActive !== false)
        .map(v => v.size);
      setAvailableSizesForColor([...new Set(sizesForColor)]);

      // Auto-select first available size
      if (sizesForColor.length > 0 && !sizesForColor.some(s => s?.toLowerCase() === selectedSize?.toLowerCase())) {
        setSelectedSize(sizesForColor[0]);
      }
    }
  }, [selectedColor, variants, selectedSize]);

  // Find the selected variant
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        v => v.color?.toLowerCase() === selectedColor?.toLowerCase() &&
          v.size?.toLowerCase() === selectedSize?.toLowerCase() &&
          v.isActive !== false
      );
      setSelectedVariant(variant || null);

      // Reset quantity if it exceeds variant stock
      if (variant && quantity > variant.stockQuantity) {
        setQuantity(1);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, variants, quantity]);

  // Get effective price and stock from selected variant or base values
  const effectivePrice = selectedVariant?.price || basePrice || 0;
  const effectiveOfferPrice = selectedVariant?.offerPrice || baseOfferPrice || effectivePrice;
  const effectiveStock = selectedVariant?.stockQuantity || 0;

  const subTotal = quantity * effectiveOfferPrice;
  const taxAmount = subTotal * TAX_RATE;
  const totalPrice = subTotal + taxAmount + SHIPPING_COST;

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sizeParam = params.get("size");
    const colorParam = params.get("color");

    if (colorParam && availableColors?.includes(colorParam)) {
      setSelectedColor(colorParam);
    }
    if (sizeParam && availableSizes?.includes(sizeParam)) {
      setSelectedSize(sizeParam);
    }
  }, [location.search, availableColors, availableSizes]);

  const updateURL = (param, value) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set(param, value);
    navigate(
      {
        pathname: location.pathname,
        search: newSearchParams.toString(),
      },
      { replace: true }
    );
  };

  const handleIncrease = () => {
    if (quantity < MAX_QUANTITY && quantity < effectiveStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
    updateURL("size", newSize);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    updateURL("color", newColor);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a valid color and size combination");
      return;
    }

    if (!selectedVariant.sku) {
      toast.error("Variant SKU not found");
      return;
    }

    setIsLoading(true);

    if (quantity > effectiveStock) {
      toast.error("Sorry, not enough stock available.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await addToCart({
        productId,
        quantity,
        variantSKU: selectedVariant.sku,
        size: selectedSize,
        color: selectedColor,
      }).unwrap();

      const successMsg = response?.message || "Item added to cart!";
      const warningMsg =
        effectiveStock < LIMITS.LOW_STOCK_THRESHOLD && effectiveStock > 0
          ? ` Hurry! Only ${effectiveStock} items left.`
          : "";
      toast.success(successMsg + warningMsg);
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedVariant) {
      toast.error("Please select a valid color and size combination");
      return;
    }

    const productDetails = {
      productImage,
      quantity,
      offerPrice: effectiveOfferPrice,
      productName,
      variantSKU: selectedVariant.sku,
      color: selectedColor,
      size: selectedSize,
    };

    const total = totalPrice;

    navigate("/checkout", {
      state: { cartItems: [productDetails], total, productId },
    });
  };

  const isOutOfStock = effectiveStock <= 0;
  const canAddToCart = selectedColor && selectedSize && selectedVariant && !isOutOfStock;

  return (
    <div className="space-y-5">
      {/* Price and Stock Info */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{effectiveOfferPrice.toLocaleString()}
          </p>
          {effectivePrice !== effectiveOfferPrice && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ₹{effectivePrice.toLocaleString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <p
            className={`text-sm font-semibold ${effectiveStock > 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
              }`}
          >
            {selectedVariant
              ? (effectiveStock > 0 ? `${effectiveStock} in stock` : "Out of Stock")
              : `${totalStock} total stock`
            }
          </p>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="space-y-5">
        {/* Color Selection */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
            Select Color <span className="text-red-500">*</span>
          </label>
          {availableColors && availableColors.length > 0 ? (
            <div className="relative">
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 dark:border-gray-500 rounded-lg text-base font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-400"
              >
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No colors available</p>
          )}
        </div>

        {/* Size Selection */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
            Select Size <span className="text-red-500">*</span>
          </label>
          {availableSizesForColor && availableSizesForColor.length > 0 ? (
            <div className="relative">
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 dark:border-gray-500 rounded-lg text-base font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-400"
              >
                {availableSizesForColor.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {selectedColor ? "No sizes available for this color" : "Select a color first"}
            </p>
          )}
        </div>

        {/* Quantity Selection */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 text-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white dark:disabled:hover:border-gray-500 dark:disabled:hover:bg-gray-800 shadow-sm hover:shadow-md"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              −
            </button>
            <div className="min-w-[4rem] px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500 rounded-xl">
              <span className="block text-center text-xl font-bold text-gray-900 dark:text-white">
                {quantity}
              </span>
            </div>
            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 text-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white dark:disabled:hover:border-gray-500 dark:disabled:hover:bg-gray-800 shadow-sm hover:shadow-md"
              onClick={handleIncrease}
              disabled={quantity >= MAX_QUANTITY || quantity >= effectiveStock}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-medium">₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Tax (8%)</span>
          <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span className="font-medium">₹{SHIPPING_COST.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Adding to cart...</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
          onClick={handleCheckout}
          disabled={!isAuthenticated || isLoading || !canAddToCart}
        >
          {isAuthenticated ? "Buy Now" : "Sign In to Buy"}
        </button>

        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
          onClick={handleAddToCart}
          disabled={!isAuthenticated || isLoading || !canAddToCart}
        >
          {isAuthenticated ? "Add to Cart" : "Sign In to Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
