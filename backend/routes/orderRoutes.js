const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllUsersOrders,
  getUserOrdersMoadl,
  getAddressByOrderId,
  returnOrder,
  getUserIndividualOrders,
  getOrdersGrouped,
  getSingleOrderDetails,
  cancelEntireOrder,
  getAllOrdersForAdmin,
  getAdminOrderDetails,
} = require("../controller/orderController");
const { isAuthenticated } = require("../middleware/auth");

// User order routes
router.get("/getOrders", isAuthenticated, catchAsyncErrors(getAllOrders));
router.get("/orders-grouped", isAuthenticated, catchAsyncErrors(getOrdersGrouped));
router.get("/order-details/:orderId", isAuthenticated, catchAsyncErrors(getSingleOrderDetails));
router.get("/get-users-individual-orders", isAuthenticated, catchAsyncErrors(getUserIndividualOrders));

// Admin order routes
router.get("/admin/all-orders", catchAsyncErrors(getAllOrdersForAdmin));
router.get("/admin/order-details/:orderId", catchAsyncErrors(getAdminOrderDetails));
router.get("/getUsersOrders", catchAsyncErrors(getAllUsersOrders));
router.get("/getOrder/:id", catchAsyncErrors(getOrderById));
router.get("/user-order-modal", catchAsyncErrors(getUserOrdersMoadl));
router.get("/:orderId/address", catchAsyncErrors(getAddressByOrderId));

// Order actions
router.post("/create", catchAsyncErrors(createOrder));
router.patch("/update-bulk", catchAsyncErrors(updateOrderStatus));
router.patch("/:orderId/cancel/:productId", catchAsyncErrors(cancelOrder));
router.patch("/:orderId/cancel-order", isAuthenticated, catchAsyncErrors(cancelEntireOrder));
router.patch("/:orderId/return/:productId", catchAsyncErrors(returnOrder));

module.exports = router;
