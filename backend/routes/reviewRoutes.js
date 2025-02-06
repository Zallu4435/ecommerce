const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  addReview,
  getReviews,
  hasUserReviewed,
} = require("../controller/reviewController");

router.get("/get-reviews", catchAsyncErrors(getReviews));
router.post("/add-review", isAuthenticated, catchAsyncErrors(addReview));
router.get("/has-reviewed", isAuthenticated, catchAsyncErrors(hasUserReviewed));

module.exports = router;
