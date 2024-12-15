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
    discount: {
        type: mongoose.Schema.Types.Decimal128, 
        required: true,      
    },
    minPurchase: {
        type: mongoose.Schema.Types.Decimal128, 
        default: 0,         
    },
    expiry: {
        type: Date,           
        required: true,      
    },
    maxDiscount: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,           
    },
  },
  {
        timestamps: true,   
  }
);


module.exports =  mongoose.model('Coupons', CouponsSchema);
