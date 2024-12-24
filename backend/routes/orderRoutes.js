const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllUsersOrders,
  getUserOrdersMoadl,

} = require('../controller/orderController');
const { isAuthenticated } = require('../middleware/auth');

// User and Admin
router.get('/getOrders',isAuthenticated, catchAsyncErrors(getAllOrders)); // Get all orders
router.get('/getUsersOrders', catchAsyncErrors(getAllUsersOrders)); // Get all orders

router.get('/getOrder/:id', catchAsyncErrors(getOrderById)); // Get order details

router.get('/user-order-modal', catchAsyncErrors(getUserOrdersMoadl))
// Admin only (with authentication check)
router.post(
  '/create', 
  catchAsyncErrors(createOrder) 
); // Create order

router.patch(
  '/update-bulk', 
  catchAsyncErrors(updateOrderStatus)
); // Update order

router.patch(
  '/cancel/:orderId', 
  catchAsyncErrors(cancelOrder)
); // Delete order

module.exports = router;
