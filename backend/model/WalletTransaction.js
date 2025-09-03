const mongoose =  require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true, 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"], 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, 
    },
    description: {
      type: String,
      trim: true, 
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "Pending",
    },
    // New fields for comprehensive tracking
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false, // Optional for wallet recharges
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "wallet", "cod", "card"],
      required: false,
    },
    razorpayPaymentId: {
      type: String,
      required: false,
    },
    razorpayOrderId: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  }
);

TransactionSchema.index({ walletId: 1, userId: 1, createdAt: -1 });
TransactionSchema.index({ orderId: 1 });
TransactionSchema.index({ razorpayPaymentId: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);

