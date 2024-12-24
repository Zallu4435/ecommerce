const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Assuming a User model
    items: [
        {
            Price: { 
                type: Number
            },
            ProductId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'products'
            },
            Quantity: { 
                type: Number 
            },
            createdAt: {  // Corrected the typo here
                type: Date,  // Corrected the type
                default: Date.now  // Sets the default to the current date
            },
            updatedAt: {
                type: Date,  // Corrected the type
                default: Date.now  // Sets the default to the current date
            }
        },
    ],
    // PaymentId: {
    //      type: mongoose.Schema.Types.ObjectId, 
    //      ref: 'Payment' 
    // }, 
    CoupenId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coupen' 
    }, 
    TotalAmount: {
        type: Number, 
        default: 0 
    }, 
    Status: {
         type: String, default: 'Pending'
    }, 
    Address: {
        username: { type: String, },
        street: { type: String, },
        city: { type: String, },
        state: { type: String, },
        country: { type: String, },
        zipCode: { type: String, },
        phone: { type: String, },
        house: { type: String, },
        landmark: { type: String, }
    }
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
