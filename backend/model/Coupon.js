const mongoose = require('mongoose');

const CouponsSchema = new mongoose.Schema(
    {
    UserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',      
    },
    CoupenCode: {
        type: String,         
    },
    Discount: {
        type: mongoose.Schema.Types.Decimal128, 
        required: true,      
    },
    MinPurchase: {
        type: mongoose.Schema.Types.Decimal128, 
        default: 0,         
    },
    Expiry: {
        type: Date,           
        required: true,      
    },
    MaxDiscount: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,           
    },
  },
  {
        timestamps: true,   
  }
);


module.exports =  mongoose.model('Coupons', CouponsSchema);
