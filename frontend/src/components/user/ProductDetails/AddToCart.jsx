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
        .filter(v => v.color === selectedColor && v.stockQuantity > 0 && v.isActive !== false)
        .map(v => v.size);
      setAvailableSizesForColor([...new Set(sizesForColor)]);

      // Auto-select first available size
      if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
        setSelectedSize(sizesForColor[0]);
      }
    }
  }, [selectedColor, variants, selectedSize]);

  // Find the selected variant
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        v => v.color === selectedColor && v.size === selectedSize && v.isActive !== false
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-96 mx-auto flex flex-col space-y-4 transition-all duration-300 transform hover:scale-105">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Order Summary
        </h2>
        <div className="flex justify-between">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            Price: ₹{effectiveOfferPrice}
            {effectivePrice !== effectiveOfferPrice && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ₹{effectivePrice}
              </span>
            )}
          </p>
          <p
            className={`text-sm font-bold mb-4 ${effectiveStock > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
              }`}
          >
            {selectedVariant
              ? (effectiveStock > 0 ? `Stock: ${effectiveStock}` : "Out of Stock")
              : `Total Stock: ${totalStock}`
            }
          </p>
        </div>

        <div className="space-y-4">
          {/* Color Selection */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Color: *
            </label>
            {availableColors && availableColors.length > 0 ? (
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w-full transition-colors duration-200"
              >
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No colors available</span>
            )}
          </div>

          {/* Size Selection */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Size: *
            </label>
            {availableSizesForColor && availableSizesForColor.length > 0 ? (
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w-full transition-colors duration-200"
              >
                {availableSizesForColor.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {selectedColor ? "No sizes available for this color" : "Select a color first"}
              </span>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Quantity:
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 transition-colors duration-200"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 text-gray-800 dark:text-gray-100">
                {quantity}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 transition-colors duration-200"
                onClick={handleIncrease}
                disabled={quantity >= MAX_QUANTITY || quantity >= effectiveStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 border-t pt-4 border-gray-300 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-300 flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 flex justify-between">
            <span>Tax (8%):</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 flex justify-between">
            <span>Shipping:</span>
            <span>₹{SHIPPING_COST.toFixed(2)}</span>
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100 flex justify-between">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
          Adding to cart...
        </p>
      )}

      <div className="flex flex-col gap-4 mt-auto">
        <button
          style={{
            opacity:
              isLoading || !canAddToCart || !isAuthenticated ? 0.5 : 1,
            cursor:
              isLoading || !canAddToCart || !isAuthenticated
                ? "not-allowed"
                : "pointer",
          }}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
          onClick={handleCheckout}
          disabled={!isAuthenticated || isLoading || !canAddToCart}
        >
          {isAuthenticated ? "Buy Now" : "SignIn to Buy"}
        </button>

        <button
          className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-all duration-300 transform hover:scale-105 ${!canAddToCart || !isAuthenticated || isLoading
              ? "opacity-50 cursor-not-allowed"
              : ""
            }`}
          onClick={handleAddToCart}
          disabled={!isAuthenticated || isLoading || !canAddToCart}
        >
          {isAuthenticated ? "Add to Cart" : "SignIn to Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
