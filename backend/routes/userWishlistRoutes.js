const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controller/userWishlistController');

// Add product to wishlist
router.post('/wishlist', isAuthenticated, catchAsyncErrors(addToWishlist));
router.get("/wishlist", isAuthenticated, catchAsyncErrors(getWishlist));

// Remove product from wishlist
router.delete('/wishlist/:id', isAuthenticated, catchAsyncErrors(removeFromWishlist));

module.exports = router;
