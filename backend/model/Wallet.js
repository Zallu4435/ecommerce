const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        TransactionAmount: { 
            type: Number 
        },
    },
    { 
        timestamps: true 
    }
);

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
