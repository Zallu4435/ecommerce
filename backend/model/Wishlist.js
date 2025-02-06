const mongoose = require('mongoose');


const wishlistSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                updatedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

    },
    {
        timestamps: true
    }
);


wishlistSchema.pre('save', function (next) {
    this.items.forEach((item) => {
        item.updatedAt = Date.now();
    });
    next();
});


module.exports = mongoose.model('Wishlist', wishlistSchema);
