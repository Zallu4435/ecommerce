const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controller/userWishlistController");

router.post("/wishlist", isAuthenticated, catchAsyncErrors(addToWishlist));
router.get("/wishlist", isAuthenticated, catchAsyncErrors(getWishlist));
router.delete(
  "/wishlist/:id",
  isAuthenticated,
  catchAsyncErrors(removeFromWishlist)
);

module.exports = router;
