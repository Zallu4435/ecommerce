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
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
