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
  getUserIndividualOrders
} = require("../controller/orderController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/getOrders", isAuthenticated, catchAsyncErrors(getAllOrders));
router.get("/get-users-individual-orders", isAuthenticated, catchAsyncErrors(getUserIndividualOrders));
router.get("/getUsersOrders", catchAsyncErrors(getAllUsersOrders));
router.get("/getOrder/:id", catchAsyncErrors(getOrderById));

router.get("/user-order-modal", catchAsyncErrors(getUserOrdersMoadl));
router.get("/:orderId/address", catchAsyncErrors(getAddressByOrderId));

router.post("/create", catchAsyncErrors(createOrder));
router.patch("/update-bulk", catchAsyncErrors(updateOrderStatus));
router.patch("/:orderId/cancel/:productId", catchAsyncErrors(cancelOrder));
router.patch("/:orderId/return/:productId", catchAsyncErrors(returnOrder));

module.exports = router;
