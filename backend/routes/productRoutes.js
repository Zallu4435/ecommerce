const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError')
const { 
  getAllProducts, 
  getProductDetails, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controller/productController');


// User and Admin
router.get('/getProducts', catchAsyncErrors(getAllProducts)); // Get all products
router.get('/getProduct/:id', catchAsyncErrors(getProductDetails)); // Get product details

// Admin only (with authentication check)
router.post(
  '/create-product', 
  catchAsyncErrors(createProduct)
); // Create product

router.put(
  '/update-product/:id', 
  catchAsyncErrors(updateProduct)
); // Update product

router.delete( 
  '/delete-product/:id', 
  catchAsyncErrors(deleteProduct)
); // Delete product


console.log(createProduct)

module.exports = router;
