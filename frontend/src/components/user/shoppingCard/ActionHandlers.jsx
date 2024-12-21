import { toast } from 'react-toastify';

export const handleAddToCart = async (_id, addToCart, refetchCart, setIsAdding) => {
  const productDetails = {
    productId: _id,
    quantity: 1,
  };

  try {
    setIsAdding(true);
    await addToCart(productDetails);
    await refetchCart();
    toast.success("Item added to cart!");
  } catch (error) {
    toast.error(error.message || "Failed to add item to cart.");
  } finally {
    setIsAdding(false);
  }
};

export const handleAddToWishlist = async (_id, { addToWishlist, refetchWishlist }) => {
  try {
    await addToWishlist(_id);
    await refetchWishlist();
    toast.success("Product added to wishlist");
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

export const handleAddToComparison = async (_id, { addToComparison, refetchComparison }) => {
  try {
    await addToComparison(_id);
    await refetchComparison();
    toast.success("Product added to Comparison");
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

export const handleViewProduct = (_id) => {
  toast.success(`Viewing Product Details for ID: ${_id}`);
};

