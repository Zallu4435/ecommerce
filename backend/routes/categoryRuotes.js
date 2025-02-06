const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories,
} = require('../controller/categoryController');

router.get('/getCategories', catchAsyncErrors(getAllCategories)); 
router.get('/getCategory/:id', catchAsyncErrors(getCategoryDetails)); 
router.get('/getPopularCategories', catchAsyncErrors(getPopularCategories));
router.post('/create', catchAsyncErrors(createCategory));
router.put('/update/:id', catchAsyncErrors(updateCategory)); 
router.delete('/delete/:id', catchAsyncErrors(deleteCategory)); 

module.exports = router;
