const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  getOrders,
  getSalesOverview,
  getSaleById,
  updateSaleStatus,
  getTopSellingProducts,
} = require("../controller/salesController");

router.get("/getSalesData", catchAsyncErrors(getOrders));
router.get("/getSalesOverview", catchAsyncErrors(getSalesOverview));
router.get("/getSaleById/:id", catchAsyncErrors(getSaleById));
router.get("/getTopSellingProducts", catchAsyncErrors(getTopSellingProducts));
router.patch("/updateSaleStatus", catchAsyncErrors(updateSaleStatus));

module.exports = router;
