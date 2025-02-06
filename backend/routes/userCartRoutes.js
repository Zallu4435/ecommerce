const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { addToCart, getCartItems, removeFromCart, updateCartQuantity } = require("../controller/userCartController");

router.post("/cart", isAuthenticated, catchAsyncErrors(addToCart));
router.get("/cart", isAuthenticated, catchAsyncErrors(getCartItems));
router.delete("/cart/:id", isAuthenticated, catchAsyncErrors(removeFromCart));
router.put('/cart-update-quantity', isAuthenticated, catchAsyncErrors(updateCartQuantity))

module.exports = router;
