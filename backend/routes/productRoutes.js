const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductDetails, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

const { isAuthenticatedUser } = require('../middleware/auth');

// User and Admin
router.get('/products', catchAsyncErrors(getAllProducts)); // Get all products
router.get('/products/:id', catchAsyncErrors(getProductDetails)); // Get product details

// Admin only (with authentication check)
router.post(
  '/admin/product/new', 
  isAuthenticatedUser, 
  catchAsyncErrors(createProduct)
); // Create product

router.put(
  '/admin/product/:id', 
  isAuthenticatedUser, 
  catchAsyncErrors(updateProduct)
); // Update product

router.delete(
  '/admin/product/:id', 
  isAuthenticatedUser, 
  catchAsyncErrors(deleteProduct)
); // Delete product

module.exports = router;
