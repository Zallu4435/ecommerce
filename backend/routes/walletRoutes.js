const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  addMoneyToWallet,
  withdrawMoneyFromWallet,
  getWalletDetails,
  handleRazorpaySuccess,
} = require('../controller/walletController');

const router = express.Router();

// Route to add money to wallet
router.post('/add-money', isAuthenticated, addMoneyToWallet);

// Route to withdraw money from wallet
router.post('/withdraw-money', isAuthenticated, withdrawMoneyFromWallet);

// Route to get wallet details by userId
router.get('/transactions', isAuthenticated, getWalletDetails);

// Route to handle Razorpay success callback
router.post('/razorpay-success', isAuthenticated, handleRazorpaySuccess);

module.exports = router;
