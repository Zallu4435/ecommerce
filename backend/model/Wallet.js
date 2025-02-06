const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        balance: {
            type: Number,
            required :true, 
            default: 0,
            min: 0,
            max:100000
        },
        status: {
            type: String,
            required: true,
            enum: ['Active', 'Suspended', 'Closed'],
            default: "Active"
        }
    },
    { 
        timestamps: true 
    }
);

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
