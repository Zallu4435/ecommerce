const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        ReviewMsg: { 
            type: String 
        },
        Rating: { 
            type: Number 
        },
        ProductId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    },
    { 
        timestamps: true 
    }
);

const Reviews = mongoose.model('Reviews', ReviewsSchema);

module.exports = Reviews;
