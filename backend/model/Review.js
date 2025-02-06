const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products', 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productId: 1 });  
reviewSchema.index({ userId: 1 });     
reviewSchema.index({ createdAt: -1 }); 

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
