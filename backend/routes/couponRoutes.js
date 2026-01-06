const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");
const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCouponStatistics,
  getActiveCoupons,
  updateApplicables,
  checkoutCoupons,
} = require("../controller/couponController");

router.get("/getCoupons", catchAsyncErrors(getAllCoupons));
router.get("/coupon/:id", catchAsyncErrors(getCoupon));
router.get("/getActiveCoupons", catchAsyncErrors(getActiveCoupons));
router.get(
  "/checkout-coupons/:productId",
  isAuthenticated,
  catchAsyncErrors(checkoutCoupons)
);

router.post("/create", catchAsyncErrors(createCoupon));
router.put("/update/:id", catchAsyncErrors(updateCoupon));
router.patch("/patch/:id", catchAsyncErrors(updateApplicables));
router.delete("/delete/:id", catchAsyncErrors(deleteCoupon));

router.post("/validate", isAuthenticated, catchAsyncErrors(validateCoupon));

router.get("/getCouponStats", catchAsyncErrors(getCouponStatistics));

module.exports = router;
