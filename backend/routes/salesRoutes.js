const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  getOrders,
  getSalesOverview,
  getTopSellingProducts,
  getTopSellingBrands,
  getTopSellingCategories
} = require("../controller/salesController");

router.get("/getSalesData", catchAsyncErrors(getOrders));
router.get("/getSalesOverview", catchAsyncErrors(getSalesOverview));
router.get("/getTopSellingProducts", catchAsyncErrors(getTopSellingProducts));
router.get("/getTopSellingBrands", catchAsyncErrors(getTopSellingBrands));
router.get("/getTopSellingCategories", catchAsyncErrors(getTopSellingCategories));

module.exports = router;
