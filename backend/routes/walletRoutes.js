const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  addMoneyToWallet,
  withdrawMoneyFromWallet,
  getWalletDetails,
  handleRazorpaySuccess,
} = require("../controller/walletController");

const router = express.Router();

router.get("/transactions", isAuthenticated, getWalletDetails);
router.post("/add-money", isAuthenticated, addMoneyToWallet);
router.post("/withdraw-money", isAuthenticated, withdrawMoneyFromWallet);
router.post("/razorpay-success", isAuthenticated, handleRazorpaySuccess);

module.exports = router;
