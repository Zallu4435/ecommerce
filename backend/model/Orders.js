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
                    ref: 'Product'
                },
                Quantity: { 
                    type: Number 
                },
                craetedAt: {
                    type: Date.now,
                    default: Date.now
                },  
                updatedAt: {
                    type: Date.now,
                    default: Date.now
                }
            },
        ],
        PaymentId: {
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'Payment' 
            }, 
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
        AddressId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Address' 
        },  
    },
    {
        timestamps: true, 
    }
);


OrdersSchema.pre('save', function (next) {
    this.items.forEach(item => {
        item.updatedAt = Date.now();
    });
    next();
})

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders;
