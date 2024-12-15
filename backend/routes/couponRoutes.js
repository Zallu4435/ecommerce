const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { 
  getAllCoupons, 
  getCouponDetails, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  validateCoupon, 
  getCouponStatistics, 
  getActiveCoupons 
} = require('../controller/couponController');

// User and Admin
router.get('/getCoupons', catchAsyncErrors(getAllCoupons)); // Get all coupons
router.get('/getCoupon/:id', catchAsyncErrors(getCouponDetails)); // Get coupon details
router.get('/getActiveCoupons', catchAsyncErrors(getActiveCoupons)); // Get active coupons

// Admin only
router.post('/create', catchAsyncErrors(createCoupon)); // Create a new
router.put('/update/:id', catchAsyncErrors(updateCoupon)); // Update a
router.delete('/delete/:id', catchAsyncErrors(deleteCoupon)); // Delete a

// Validation
router.post('/validate', catchAsyncErrors(validateCoupon)); // Validate a coupon code

// Aggregation-based Routes
router.get('/getCouponStats', catchAsyncErrors(getCouponStatistics)); // Get coupon statistics

module.exports = router;
