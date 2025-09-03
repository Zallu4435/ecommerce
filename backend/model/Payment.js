const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        },
        transactionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Wallet'
        },
        status: { 
            type: String, 
            enum: ['Successful', 'Pending', 'Failed', 'Refunded'], 
            default: 'Pending' 
        },
        method: { 
            type: String, required: true 
        },
        amount: { 
            type: Number, required: true 
        },
        OrderId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true 
        },
        // Enhanced fields for Razorpay tracking
        razorpayPaymentId: {
            type: String,
            required: false,
        },
        razorpayOrderId: {
            type: String,
            required: false,
        },
        refundAmount: {
            type: Number,
            default: 0,
        },
        refundStatus: {
            type: String,
            enum: ['None', 'Partial', 'Full', 'Refunded'],
            default: 'None',
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
PaymentSchema.index({ userId: 1, OrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
