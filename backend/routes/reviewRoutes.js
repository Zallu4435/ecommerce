const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  addReview,
  getReviews,
  hasUserReviewed,
  updateReview,
  deleteReview,
  canUserReview,
} = require("../controller/reviewController");

router.get("/get-reviews", catchAsyncErrors(getReviews));
router.post("/add-review", isAuthenticated, catchAsyncErrors(addReview));
router.put("/update-review/:reviewId", isAuthenticated, catchAsyncErrors(updateReview));
router.delete("/delete-review/:reviewId", isAuthenticated, catchAsyncErrors(deleteReview));
router.get("/has-reviewed", isAuthenticated, catchAsyncErrors(hasUserReviewed));
router.get("/can-review", isAuthenticated, catchAsyncErrors(canUserReview));

module.exports = router;
