const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  addMoneyToWallet,
  withdrawMoneyFromWallet,
  getWalletDetails,
  handleRazorpaySuccess,
  handleFailedPayment,
  getTransactionSummary,
} = require("../controller/walletController");

const router = express.Router();

router.get("/transactions", isAuthenticated, getWalletDetails);
router.get("/transaction-summary", isAuthenticated, getTransactionSummary);
router.post("/add-money", isAuthenticated, addMoneyToWallet);
router.post("/withdraw-money", isAuthenticated, withdrawMoneyFromWallet);
router.post("/razorpay-success", isAuthenticated, handleRazorpaySuccess);
router.post("/failed-payment", isAuthenticated, handleFailedPayment);

module.exports = router;
