import { toast } from "react-toastify";

/**
 * Comprehensive Edge Case Validator for E-Commerce Actions
 * Handles all validation for Cart, Wishlist, and Comparison operations
 */

export const LIMITS = {
    CART_MAX: 50,
    WISHLIST_MAX: 15,
    COMPARISON_MAX: 4,
    CART_QUANTITY_MAX: 7,
    LOW_STOCK_THRESHOLD: 5,
};

/**
 * Helper: Check if product exists in list (robust ID check)
 * Handles string/number mismatch and nested objects
 */
const checkExists = (list, productId) => {
    if (!productId) return false;
    const targetId = String(productId);
    return list?.some((item) => {
        // Check item.productId (Flat), item._id (Direct), item.product._id (Nested)
        return (
            String(item.productId || "") === targetId ||
            String(item._id || "") === targetId ||
            String(item.product?._id || "") === targetId
        );
    });
};

/**
 * Validate adding product to cart (from Wishlist or Comparison)
 */
export const validateAddToCart = ({
    product,
    cartData = [],
    stockQuantity,
}) => {
    if (!product) return { valid: false, reason: "invalid_product" };

    // Edge Case 1: Stock validation
    if (!stockQuantity || stockQuantity === 0) {
        toast.error("Product is out of stock");
        return { valid: false, reason: "out_of_stock" };
    }

    // Edge Case 2: Check if already in cart
    const productIdToCheck = product.productId || product._id;
    if (checkExists(cartData, productIdToCheck)) {
        toast.warning("Product already in cart. Update quantity from cart page.");
        return { valid: false, reason: "already_in_cart" };
    }

    // Edge Case 3: Cart limit validation
    if (cartData?.length >= LIMITS.CART_MAX) {
        toast.error(`Cart is full. Maximum ${LIMITS.CART_MAX} items allowed.`);
        return { valid: false, reason: "cart_full" };
    }

    // Edge Case 4: Low stock warning
    let warning = null;
    if (stockQuantity < LIMITS.LOW_STOCK_THRESHOLD && stockQuantity > 0) {
        warning = `Hurry! Only ${stockQuantity} items left.`;
    }

    return { valid: true, warning };
};

/**
 * Validate adding product to wishlist
 */
export const validateAddToWishlist = ({ product, wishlistData = [] }) => {
    if (!product) return { valid: false, reason: "invalid_product" };

    // Edge Case 1: Check if already in wishlist
    const productIdToCheck = product.productId || product._id;
    if (checkExists(wishlistData, productIdToCheck)) {
        toast.warning("Product already in wishlist");
        return { valid: false, reason: "already_in_wishlist" };
    }

    // Edge Case 2: Wishlist limit validation
    if (wishlistData?.length >= LIMITS.WISHLIST_MAX) {
        toast.error(
            `Wishlist is full. Maximum ${LIMITS.WISHLIST_MAX} items allowed.`
        );
        return { valid: false, reason: "wishlist_full" };
    }

    return { valid: true };
};

/**
 * Validate adding product to comparison
 */
export const validateAddToComparison = ({ product, comparisonData = [] }) => {
    if (!product) return { valid: false, reason: "invalid_product" };

    // Edge Case 1: Check if already in comparison
    const productIdToCheck = product.productId || product._id;
    if (checkExists(comparisonData, productIdToCheck)) {
        toast.warning("Product already in comparison list");
        return { valid: false, reason: "already_in_comparison" };
    }

    // Edge Case 2: Comparison limit validation (max 4 items)
    if (comparisonData?.length >= LIMITS.COMPARISON_MAX) {
        toast.error(
            `Comparison list is full. Maximum ${LIMITS.COMPARISON_MAX} items allowed.`
        );
        return { valid: false, reason: "comparison_full" };
    }

    // Edge Case 3: Category validation (can only compare same category)
    if (comparisonData?.length > 0) {
        const firstCategory = comparisonData[0].category;
        const productCategory = product.category;

        // Only validate if both have category (safe default)
        if (firstCategory && productCategory) {
            // Case-insensitive comparison
            const prodCatLower = String(productCategory).toLowerCase().trim();
            const firstCatLower = String(firstCategory).toLowerCase().trim();

            if (prodCatLower !== firstCatLower) {
                toast.error(
                    `Can only compare products from the same category. First product is "${firstCategory}", but you're trying to add "${productCategory}"`
                );
                return { valid: false, reason: "different_category" };
            }
        }
    }

    return { valid: true };
};

/**
 * Handle API errors with user-friendly messages
 */
export const handleApiError = (error, action = "perform this action") => {
    const errorMessage =
        error?.data?.message || error?.message || `Failed to ${action}`;

    if (errorMessage.includes("stock")) {
        toast.error("Product is out of stock or insufficient quantity available");
    } else if (
        errorMessage.includes("exist") ||
        errorMessage.includes("already")
    ) {
        toast.warning("Product already exists in the list");
    } else if (errorMessage.includes("limit") || errorMessage.includes("full")) {
        toast.error("List is full. Please remove some items first.");
    } else if (errorMessage.includes("category")) {
        toast.error("Can only compare products from the same category");
    } else if (errorMessage.includes("auth") || errorMessage.includes("login")) {
        toast.error("Please login to continue");
    } else {
        toast.error(errorMessage);
    }
};

/**
 * Get stock status badge info
 */
export const getStockStatus = (stockQuantity) => {
    if (!stockQuantity || stockQuantity === 0) {
        return {
            label: "Out of Stock",
            className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            available: false,
        };
    }

    if (stockQuantity < LIMITS.LOW_STOCK_THRESHOLD) {
        return {
            label: `Only ${stockQuantity} left`,
            className:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            available: true,
        };
    }

    return {
        label: "In Stock",
        className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        available: true,
    };
};

/**
 * Check if product can be added to cart (Simple boolean check)
 */
export const canAddToCart = ({ stockQuantity, cartData, productId }) => {
    if (!stockQuantity || stockQuantity === 0) return false;
    if (checkExists(cartData, productId)) return false;
    if (cartData?.length >= LIMITS.CART_MAX) return false;
    return true;
};
