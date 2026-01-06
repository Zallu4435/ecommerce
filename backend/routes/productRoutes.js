const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getAllShopProducts,
  getRelatedProducts,
  getFilteredProducts,
  searchProducts,
} = require("../controller/productController");

router.get("/getProducts", catchAsyncErrors(getAllProducts));
router.get("/getShopProducts", catchAsyncErrors(getAllShopProducts));
router.get("/getProduct/:id", catchAsyncErrors(getProductDetails));

router.get("/relatedProduct", catchAsyncErrors(getRelatedProducts));
router.get("/filter", catchAsyncErrors(getFilteredProducts));
router.get("/search", catchAsyncErrors(searchProducts));
router.get("/get-popular-products", catchAsyncErrors(getPopularProducts));

router.post("/create", catchAsyncErrors(createProduct));
router.put("/update/:id", catchAsyncErrors(updateProduct));
router.delete("/delete/:id", catchAsyncErrors(deleteProduct));


module.exports = router;
