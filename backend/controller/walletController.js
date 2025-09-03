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

exports.handleFailedPayment = async (req, res) => {
  try {
    const { userId, orderId, amount, paymentMethod, description, error } = req.body;

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

    // Create failed transaction record for tracking
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId,
      type: "Debit", // Failed payment attempt
      amount,
      description: description || `Failed ${paymentMethod} payment`,
      status: "Failed",
      orderId: orderId,
      paymentMethod: paymentMethod,
    });

    res.status(200).json({
      success: true,
      message: "Failed payment recorded successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user;
    const { startDate, endDate, type, status, paymentMethod } = req.query;

    let query = { userId };

    // Add date filters if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add type filter
    if (type && ['Credit', 'Debit'].includes(type)) {
      query.type = type;
    }

    // Add status filter
    if (status && ['Pending', 'Successful', 'Failed'].includes(status)) {
      query.status = status;
    }

    // Add payment method filter
    if (paymentMethod && ['razorpay', 'wallet', 'cod', 'card'].includes(paymentMethod)) {
      query.paymentMethod = paymentMethod;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate('orderId', 'TotalAmount items')
      .populate('userId', 'name email');

    // Calculate summary statistics
    const totalCredit = transactions
      .filter(t => t.type === 'Credit' && t.status === 'Successful')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter(t => t.type === 'Debit' && t.status === 'Successful')
      .reduce((sum, t) => sum + t.amount, 0);

    const successfulPayments = transactions.filter(t => 
      t.status === 'Successful' && t.paymentMethod === 'razorpay'
    ).length;

    const failedPayments = transactions.filter(t => 
      t.status === 'Failed'
    ).length;

    res.status(200).json({
      success: true,
      transactions,
      summary: {
        totalCredit,
        totalDebit,
        netAmount: totalCredit - totalDebit,
        successfulPayments,
        failedPayments,
        totalTransactions: transactions.length
      }
    });

  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.handleRazorpaySuccess = async (req, res) => {
  try {
    const { userId, razorpayPaymentId, razorpayOrderId, amount, description } = req.body;

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
      description: description || "Wallet recharge via Razorpay",
      status: "Successful",
      paymentMethod: "razorpay",
      razorpayPaymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
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
