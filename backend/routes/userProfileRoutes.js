const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");
const {
  addAddress,
  editAddress,
  removeAddress,
  getAddress,
  getAddressById,
  changePassword,
  checkoutAddress,
  processPayment,
  checkProductStock,
  contact,
  primaryAddress,
  verifyRazorpayPayment,
  retryPayment,
  cancelPayment
} = require("../controller/userProfileController");

router.post('/contact', catchAsyncErrors(contact))

router.post("/address", isAuthenticated, catchAsyncErrors(addAddress));
router.put("/address", isAuthenticated, catchAsyncErrors(editAddress));
router.delete("/address/:id", isAuthenticated, catchAsyncErrors(removeAddress));
router.get("/addresses", isAuthenticated, catchAsyncErrors(getAddress));
router.get("/address/:id", isAuthenticated, catchAsyncErrors(getAddressById));
router.put(
  "/change-password",
  isAuthenticated,
  catchAsyncErrors(changePassword)
);
router.patch('/address/set-primary/:addressId', isAuthenticated, primaryAddress)

router.get(
  "/checkout-address",
  isAuthenticated,
  catchAsyncErrors(checkoutAddress)
);
router.post(
  "/process-payment",
  isAuthenticated,
  catchAsyncErrors(processPayment)
);
router.post(
  "/verify-razorpay-payment",
  isAuthenticated,
  catchAsyncErrors(verifyRazorpayPayment)
);
router.post(
  "/retry-payment",
  isAuthenticated,
  catchAsyncErrors(retryPayment)
);
router.post(
  "/cancel-payment",
  isAuthenticated,
  catchAsyncErrors(cancelPayment)
);
router.get("/products/:productId/stock", catchAsyncErrors(checkProductStock));

module.exports = router;
