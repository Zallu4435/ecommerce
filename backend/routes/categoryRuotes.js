const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controller/categoryController');

// Routes
router.get('/getCategories', catchAsyncErrors(getAllCategories)); // Get all categories
router.get('/getCategory/:id', catchAsyncErrors(getCategoryDetails)); // Get category details
router.post('/create', catchAsyncErrors(createCategory)); // Create category
router.post('/update/:id', catchAsyncErrors(updateCategory)); // Update category
router.delete('/delete/:id', catchAsyncErrors(deleteCategory)); // Delete category

module.exports = router;
