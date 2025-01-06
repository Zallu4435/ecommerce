const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Assuming a User model
    AddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    items: [
        {
            Price: { 
                type: Number
            },
            ProductId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'products'
            },
            //pro..name, image
            Quantity: { 
                type: Number 
            },
            RefundStatus: { 
                type: String, 
                enum: ['Not Initiated', 'Pending', 'Refunded', 'Failed'], 
                default: 'Not Initiated' 
            },
            createdAt: {  // Corrected the typo here
                type: Date,  // Corrected the type
                default: Date.now  // Sets the default to the current date
            },
            updatedAt: {
                type: Date,  // Corrected the type
                default: Date.now  // Sets the default to the current date
            },
            Status: {
                type: String, default: 'Pending'
           }, 
        },
    ],
    // PaymentId: {
    //      type: mongoose.Schema.Types.ObjectId, 
    //      ref: 'Payment' 
    // }, 
    CouponDiscount: { type: Number, default: 0 }, // Discount applied via coupon
    TotalAmount: { type: Number, required: true }, // Total after discount
    Subtotal: { type: Number, required: true }, // Total before discount
    RefundAmount: { type: Number, default: 0 }, // Total refund amount for this order
    CoupenId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coupen' 
    }, 
    TotalAmount: {
        type: Number, 
        default: 0 
    }, 
},
{
    timestamps: true,  // Automatically adds createdAt and updatedAt at the document level
});

OrdersSchema.pre('save', function (next) {
    this.items.forEach(item => {
        item.updatedAt = Date.now();  // Updates updatedAt before saving
    });
    next();
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders;
