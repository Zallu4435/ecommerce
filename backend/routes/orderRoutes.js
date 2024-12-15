const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const {
  getAllOrders,
  getOrderDetails,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controller/orderController');

// User and Admin
router.get('/getOrders', catchAsyncErrors(getAllOrders)); // Get all orders
router.get('/getOrder/:id', catchAsyncErrors(getOrderDetails)); // Get order details

// Admin only (with authentication check)
router.post(
  '/create', 
  catchAsyncErrors(createOrder) 
); // Create order

router.put(
  '/update/:id', 
  catchAsyncErrors(updateOrder)
); // Update order

router.delete(
  '/delete/:id', 
  catchAsyncErrors(deleteOrder)
); // Delete order

module.exports = router;
