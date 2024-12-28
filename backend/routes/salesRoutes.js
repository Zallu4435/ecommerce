const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const {
  getOrders,
  getSalesOverview,
  getSaleById,
  updateSaleStatus,
  getTopSellingProducts,
} = require('../controller/salesController');

// Orders routes
router.get('/getSalesData', catchAsyncErrors(getOrders)); // Paginated sales data (orders)

// Sales overview route
router.get('/getSalesOverview', catchAsyncErrors(getSalesOverview)); // Sales overview (revenue, orders, etc.)

// Fetch specific sale by ID
router.get('/getSaleById/:id', catchAsyncErrors(getSaleById)); // Fetch sale by ID

// Update sale status
router.patch('/updateSaleStatus', catchAsyncErrors(updateSaleStatus)); // Update sale status

// Top selling products route
router.get('/getTopSellingProducts', catchAsyncErrors(getTopSellingProducts)); // Top-selling products

module.exports = router;
