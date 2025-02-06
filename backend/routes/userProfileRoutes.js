const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");
const {
  addAddress,
  editAddress,
  removeAddress,
  getAddress,
  changePassword,
  checkoutAddress,
  processPayment,
  checkProductStock,
  contact,
  primaryAddress
} = require("../controller/userProfileController");

router.post('/contact', catchAsyncErrors(contact))

router.post("/address", isAuthenticated, catchAsyncErrors(addAddress));
router.put("/address", isAuthenticated, catchAsyncErrors(editAddress));
router.delete("/address/:id", isAuthenticated, catchAsyncErrors(removeAddress));
router.get("/addresses", isAuthenticated, catchAsyncErrors(getAddress));
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
router.get("/products/:productId/stock", catchAsyncErrors(checkProductStock));

module.exports = router;
