import { toast } from "react-toastify";

export const handleAddToCart = async (
  _id,
  addToCart,
  refetchCart,
  setIsAdding,
  refetchWishlist,
  refetchComparison
) => {
  const productDetails = {
    productId: _id,
    quantity: 1,
  };

  try {
    setIsAdding(true);
    const response = await addToCart(productDetails).unwrap();
    await refetchCart();
    if (refetchWishlist) {
      await refetchWishlist();
    }
    if (refetchComparison) {
      await refetchComparison();
    }
    toast.success(response?.message || "Item added to cart!");
  } catch (error) {
    toast.error(error?.data?.message || error?.message || "Failed to add item to cart.");
  } finally {
    setIsAdding(false);
  }
};

export const handleAddToWishlist = async (
  _id,
  { addToWishlist, refetchWishlist }
) => {
  try {
    const response = await addToWishlist(_id).unwrap();
    await refetchWishlist();
    toast.success(response?.message || "Product added to wishlist");
  } catch (error) {
    toast.error(error?.data?.message || error?.message || "Failed to add to wishlist");
  }
};

export const handleAddToComparison = async (
  _id,
  { addToComparison, refetchComparison }
) => {
  try {
    const response = await addToComparison(_id).unwrap();
    await refetchComparison();
    toast.success(response?.message || "Product added to Comparison");
  } catch (error) {
    toast.error(error?.data?.message || error?.message || "Failed to add to comparison");
  }
};

export const handleViewProduct = (_id) => {
  toast.success(`Viewing Product Details for ID: ${_id}`);
};
