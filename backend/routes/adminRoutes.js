const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  banUser,
  loginAdmin,
  adminRefreshToken,
  getUserDetails,
  logoutAdmin,
  adminDashboard,
  searchUsers,
  searchProducts,
  searchOrders,
  searchCategories,
  searchCoupons,
  searchIndividualOrders
} = require("../controller/adminController");
const { verifyAdminRefreshToken } = require("../middleware/auth");

router.patch("/ban/:id", banUser);
router.post("/login-admin", catchAsyncErrors(loginAdmin));
router.post("/logout", catchAsyncErrors(logoutAdmin));
router.get(
  "/admin-refresh-token",
  verifyAdminRefreshToken,
  catchAsyncErrors(adminRefreshToken)
);
router.get("/get-user-details/:id", catchAsyncErrors(getUserDetails));
router.get("/metrics", catchAsyncErrors(adminDashboard));
router.get("/users/search", catchAsyncErrors(searchUsers));
router.get("/products/search", catchAsyncErrors(searchProducts));
router.get("/orders/search", catchAsyncErrors(searchOrders));
router.get("/categories/search", catchAsyncErrors(searchCategories));
router.get("/coupons/search", catchAsyncErrors(searchCoupons));

router.get("/orders/search-individual-order", catchAsyncErrors(searchIndividualOrders));


module.exports = router;
