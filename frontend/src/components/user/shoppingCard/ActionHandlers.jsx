import { toast } from "react-toastify";
import { validateAddToCart, validateAddToWishlist, validateAddToComparison, handleApiError } from "../../../utils/edgeCaseValidators";

const processingRequests = new Set();

export const handleAddToCart = async (
  _id,
  addToCart,
  setIsAdding,
  product,
  cartData
) => {
  // Check if product has variants (needs user selection)
  const hasVariants =
    product?.hasVariants ||
    (product?.availableColors && product.availableColors.length > 0) ||
    (product?.availableSizes && product.availableSizes.length > 0) ||
    (product?.availableGenders && product.availableGenders.length > 0);

  // If product has variants, redirect to product page for selection
  if (hasVariants) {
    toast.info("Please select your preferred variant (color, size, etc.) on the product page");
    // Give user time to read the toast message before redirect
    setTimeout(() => {
      window.location.href = `/product/${_id}`;
    }, 1500);
    return;
  }

  // For non-variant products, proceed with direct add to cart
  // Use centralized validation
  const validation = validateAddToCart({
    product: product || { productId: _id },
    cartData,
    stockQuantity: product?.stockQuantity,
  });

  if (!validation.valid) {
    setIsAdding(false);
    return;
  }

  const productDetails = {
    productId: _id,
    quantity: 1,
  };

  try {
    setIsAdding(true);
    const response = await addToCart(productDetails).unwrap();
    toast.success(`${response?.message || "Item added to cart!"} ${validation.warning || ""}`);
  } catch (error) {
    handleApiError(error, "add item to cart");
  } finally {
    setIsAdding(false);
  }
};

export const handleAddToWishlist = async (
  _id,
  { addToWishlist },
  product,
  wishlistData
) => {
  const requestId = `wishlist-${_id}`;
  if (processingRequests.has(requestId)) return;

  processingRequests.add(requestId);

  try {
    // Use centralized validation
    const validation = validateAddToWishlist({
      product: product || { productId: _id, _id },
      wishlistData,
    });

    if (!validation.valid) {
      return;
    }

    try {
      const response = await addToWishlist(_id).unwrap();
      toast.success(response?.message || "Product added to Wishlist");
    } catch (error) {
      handleApiError(error, "add to wishlist");
    }
  } finally {
    processingRequests.delete(requestId);
  }
};

export const handleAddToComparison = async (
  _id,
  { addToComparison },
  product,
  comparisonData
) => {
  const requestId = `compare-${_id}`;

  if (processingRequests.has(requestId)) {
    return;
  }

  processingRequests.add(requestId);

  try {
    // Use centralized validation
    const validation = validateAddToComparison({
      product: product || { productId: _id, _id },
      comparisonData,
    });

    if (!validation.valid) {
      return;
    }

    try {
      const response = await addToComparison(_id).unwrap();
      toast.success(response?.message || "Product added to Comparison");
    } catch (error) {
      handleApiError(error, "add to comparison");
    }
  } finally {
    processingRequests.delete(requestId);
  }
};

export const handleViewProduct = (_id) => {
  toast.success(`Viewing Product Details for ID: ${_id}`);
};
