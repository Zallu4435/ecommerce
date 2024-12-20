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
} = require("../controller/userProfileController");



router.post("/address", isAuthenticated, catchAsyncErrors(addAddress));
router.put("/address", isAuthenticated, catchAsyncErrors(editAddress));
router.delete("/address/:id", isAuthenticated, catchAsyncErrors(removeAddress));
router.get("/addresses", isAuthenticated, catchAsyncErrors(getAddress));
router.put("/change-password", isAuthenticated, catchAsyncErrors(changePassword));



module.exports = router;
