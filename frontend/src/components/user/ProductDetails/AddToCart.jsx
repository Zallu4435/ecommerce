import { useState, useEffect } from "react";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../redux/apiSliceFeatures/CartApiSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const TAX_RATE = 0.08;
const SHIPPING_COST = 5;

const AddToCart = ({
  productId,
  colorOption,
  sizeOption,
  originalPrice,
  productImage,
  offerPrice,
  productName,
  stockQuantity,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState((sizeOption && sizeOption[0]) || "");
  const [selectedColor, setSelectedColor] = useState((colorOption && colorOption[0]) || "");
  const [isLoading, setIsLoading] = useState(false);
  const { refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_QUANTITY = 7;

  const isAuthenticated = useSelector((state) => state?.user?.isAuthenticated);

  const subTotal = quantity * offerPrice;
  const taxAmount = subTotal * TAX_RATE;
  const totalPrice = subTotal + taxAmount + SHIPPING_COST;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sizeParam = params.get("size");
    const colorParam = params.get("color");

    if (sizeParam && sizeOption?.includes(sizeParam)) {
      setSelectedSize(sizeParam);
    }
    if (colorParam && colorOption?.includes(colorParam)) {
      setSelectedColor(colorParam);
    }

    const savedSize = localStorage.getItem(`${productId}_size`);
    const savedColor = localStorage.getItem(`${productId}_color`);

    if (savedSize && sizeOption?.includes(savedSize)) {
      setSelectedSize(savedSize);
    }
    if (savedColor && colorOption?.includes(savedColor)) {
      setSelectedColor(savedColor);
    }
  }, [location.search, productId, sizeOption, colorOption]);

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
    if (quantity < MAX_QUANTITY && quantity < stockQuantity) {
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
    localStorage.setItem(`${productId}_size`, newSize);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    updateURL("color", newColor);
    localStorage.setItem(`${productId}_color`, newColor);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    if (quantity > stockQuantity) {
      toast.error("Sorry, not enough stock available.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await addToCart({
        productId,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
      await refetchCart();

      if (response?.data?.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    const productDetails = {
      productImage,
      quantity,
      offerPrice,
      productName,
    };

    const total = totalPrice;

    navigate("/checkout", {
      state: { cartItems: [productDetails], total, productId },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-96 mx-auto flex flex-col space-y-4 transition-all duration-300 transform hover:scale-105">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Order Summary
        </h2>
        <div className="flex justify-between">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            Price: ₹{offerPrice}
          </p>
          <p
            className={`text-sm font-bold mb-4 ${
              stockQuantity > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {stockQuantity > 0 ? `Stock Left ${stockQuantity}` : "Out of Stock"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Quantity:
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 transition-colors duration-200"
                onClick={handleDecrease}
              >
                -
              </button>
              <span className="px-4 py-1 text-gray-800 dark:text-gray-100">
                {quantity}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 transition-colors duration-200"
                onClick={handleIncrease}
                disabled={quantity >= MAX_QUANTITY || quantity >= stockQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center mb-2">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Size:
            </label>
            {sizeOption && sizeOption.length > 0 ? (
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w-full transition-colors duration-200"
              >
                {sizeOption.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No sizes</span>
            )}
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 dark:text-gray-300 mr-2 w-20">
              Color:
            </label>
            {colorOption && colorOption.length > 0 ? (
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w/full transition-colors duration-200"
              >
                {colorOption.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No colors</span>
            )}
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
              isLoading || stockQuantity <= 0 || !isAuthenticated ? 0.5 : 1,
            cursor:
              isLoading || stockQuantity <= 0 || !isAuthenticated
                ? "not-allowed"
                : "pointer",
          }}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
          onClick={handleCheckout}
          disabled={!isAuthenticated || isLoading || stockQuantity <= 0}
        >
          {isAuthenticated ? "Buy Now" : "SignIn to Buy"}
        </button>

        <button
          className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-all duration-300 transform hover:scale-105 ${
            stockQuantity <= 0 || !isAuthenticated || isLoading || !selectedSize || !selectedColor
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleAddToCart}
          disabled={!isAuthenticated || isLoading || stockQuantity <= 0 || !selectedSize || !selectedColor}
        >
          {isAuthenticated ? "Add to Cart" : "SignIn to Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
