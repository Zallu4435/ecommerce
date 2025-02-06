const Transaction = require("../model/WalletTransaction"); 
const Wallet = require("../model/Wallet");

exports.addMoneyToWallet = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user;

    if (!userId || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    let wallet = await Wallet.findOne({ userId });

    if(wallet.balance >= 100000) {
      return res.status(400).json({
        success: false,
        message: "Maximum amount reached",
      })
    }

    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
        status: "Active",
      });
      await wallet.save();
    }

    wallet.balance += amount;
    await wallet.save();

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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.withdrawMoneyFromWallet = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.status !== "Active") {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found or inactive" });
    }

    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getWalletDetails = async (req, res) => {
  try {
    const userId = req.user;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      wallet,
      transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.handleRazorpaySuccess = async (req, res) => {
  try {
    const { userId, razorpayPaymentId, amount, description } = req.body;

    if (!userId || !razorpayPaymentId || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.status !== "Active") {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found or inactive" });
    }

    wallet.balance += amount;
    await wallet.save();

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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
