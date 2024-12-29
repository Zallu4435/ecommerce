const Transaction = require("../model/WalletTransaction"); // Ensure correct import
const Wallet = require("../model/Wallet"); // Ensure correct import

// Add money to wallet
exports.addMoneyToWallet = async (req, res) => {
    try {
      const { amount, description } = req.body;
      const userId = req.user;
  
      // Log incoming request data
      console.log(req.body);
  
      // Validate input
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input data" });
      }
  
      // Check if wallet exists for the user
      let wallet = await Wallet.findOne({ userId });
  
      // If no wallet found, create a new wallet for the user
      if (!wallet) {
        wallet = new Wallet({
          userId,
          balance: 0, // New wallet starts with 0 balance
          status: "Active", // Set default status to 'Active'
        });
        await wallet.save();
      }
  
      // Update wallet balance
      wallet.balance += amount;
      await wallet.save();
  
      // Create a transaction record
      const transaction = await Transaction.create({
        walletId: wallet._id,
        userId,
        type: "Credit",
        amount,
        description: description || "Wallet recharge",
        status: "Successful",
      });
  
      res.status(200).json({
        success: true,
        message: "Money added to wallet successfully",
        wallet,
        transaction,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  
// Withdraw money from wallet
exports.withdrawMoneyFromWallet = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.status !== "Active") {
      return res.status(404).json({ success: false, message: "Wallet not found or inactive" });
    }

    // Check if sufficient balance exists
    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    }

    // Update wallet balance
    wallet.balance -= amount;
    await wallet.save();

    // Create a transaction record
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId,
      type: "Debit",
      amount,
      description: description || "Wallet withdrawal",
      status: "Successful",
    });

    res.status(200).json({
      success: true,
      message: "Money withdrawn from wallet successfully",
      wallet,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Fetch wallet details and transactions
exports.getWalletDetails = async (req, res) => {
  try {
    const userId = req.user;

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    // Get transactions for the user (limit to 20 most recent)
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      wallet,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Handle Razorpay payment success (dummy)
exports.handleRazorpaySuccess = async (req, res) => {
  try {
    const { userId, razorpayPaymentId, amount, description } = req.body;

    // Validate input
    if (!userId || !razorpayPaymentId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.status !== "Active") {
      return res.status(404).json({ success: false, message: "Wallet not found or inactive" });
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Create a transaction record
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId,
      type: "Credit",
      amount,
      description: description || "Razorpay Payment",
      status: "Successful",
    });

    res.status(200).json({
      success: true,
      message: "Payment processed and wallet updated successfully",
      wallet,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
